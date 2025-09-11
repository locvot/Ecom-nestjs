import { Injectable } from '@nestjs/common'
import { OrderStatus, Prisma } from '@prisma/client'
import {
  CannotCancelOrderException,
  NotFoundCartItemException,
  OrderNotFoundException,
  OutOfStockSKUException,
  ProductNotFoundException,
  SKUNotBelongToShopException,
} from 'src/routes/order/order.error'
import {
  CancelOrderResType,
  CreateOrderBodyType,
  CreateOrderResType,
  GetOrderDetailResType,
  GetOrderListQueryType,
  GetOrderListResType,
} from 'src/routes/order/order.model'
import { OrderProducer } from 'src/routes/order/order.producer'
import { PaymentStatus } from 'src/shared/constants/payment.constant'
import { SerializeAll } from 'src/shared/constants/serialize.decorator'
import { VersionConflictException } from 'src/shared/error'
import { isNotFoundPrismaError } from 'src/shared/helpers'
import { redlock } from 'src/shared/redis'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
@SerializeAll()
export class OrderRepo {
  constructor(
    private readonly prismaService: PrismaService,
    private orderProducer: OrderProducer,
  ) {}
  async list(userId: number, query: GetOrderListQueryType): Promise<GetOrderListResType> {
    const { page, limit, status } = query
    const skip = (page - 1) * limit
    const take = limit
    const where: Prisma.OrderWhereInput = {
      userId,
      status,
    }

    // Đếm tổng số order
    const totalItem$ = this.prismaService.order.count({
      where,
    })
    // Lấy list order
    const data$ = await this.prismaService.order.findMany({
      where,
      include: {
        items: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    })
    const [data, totalItems] = await Promise.all([data$, totalItem$])
    return {
      data,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    } as any
  }

  async create(
    userId: number,
    body: CreateOrderBodyType,
  ): Promise<{
    paymentId: number
    orders: CreateOrderResType['orders']
  }> {
    // 1. Kiểm tra xem tất cả cartItemIds có tồn tại trong cơ sở dữ liệu hay không
    // 2. Kiểm tra số lượng mua có lớn hơn số lượng tồn kho hay không
    // 3. Kiểm tra xem tất cả sản phẩm mua có sản phẩm nào bị xóa hay ẩn không
    // 4. Kiểm tra xem các skuId trong cartItem gửi lên có thuộc về shopid gửi lên không
    // 5. Tạo order
    // 6. Xóa cartItem
    const allBodyCartItemIds = body.map((item) => item.cartItemIds).flat()
    const cartItemsForSKUId = await this.prismaService.cartItem.findMany({
      where: {
        id: {
          in: allBodyCartItemIds,
        },
        userId,
      },
      select: {
        skuId: true,
      },
    })
    const skuIds = cartItemsForSKUId.map((cartItem) => cartItem.skuId)

    // Lock tất cả các SKU cần mua
    const locks = await Promise.all(skuIds.map((skuId) => redlock.acquire([`lock:sku:${skuId}`], 3000))) // Giữ khóa trong 3 giây

    try {
      const [paymentId, orders] = await this.prismaService.$transaction<[number, CreateOrderResType['orders']]>(
        async (tx) => {
          // await tx.$queryRaw`SELECT * FROM "SKU" WHERE id IN (${Prisma.join(skuIds)}) FOR UPDATE`
          const cartItems = await tx.cartItem.findMany({
            where: {
              id: {
                in: allBodyCartItemIds,
              },
              userId,
            },
            include: {
              sku: {
                include: {
                  product: {
                    include: {
                      productTranslations: true,
                    },
                  },
                },
              },
            },
          })

          // 1. Kiểm tra xem tất cả cartItemIds có tồn tại trong cơ sở dữ liệu hay không
          if (cartItems.length !== allBodyCartItemIds.length) {
            throw NotFoundCartItemException
          }

          // 2. Kiểm tra số lượng mua có lớn hơn số lượng tồn kho hay không
          const isOutOfStock = cartItems.some((item) => {
            return item.sku.stock < item.quantity
          })
          if (isOutOfStock) {
            throw OutOfStockSKUException
          }

          // 3. Kiểm tra xem tất cả sản phẩm mua có sản phẩm nào bị xóa hay ẩn không
          const isExistNotReadyProduct = cartItems.some(
            (item) =>
              item.sku.product.deletedAt !== null ||
              item.sku.product.publishedAt === null ||
              item.sku.product.publishedAt > new Date(),
          )
          if (isExistNotReadyProduct) {
            throw ProductNotFoundException
          }

          // 4. Kiểm tra xem các skuId trong cartItem gửi lên có thuộc về shopid gửi lên không
          const cartItemMap = new Map<number, (typeof cartItems)[0]>()
          cartItems.forEach((item) => {
            cartItemMap.set(item.id, item)
          })
          const isValidShop = body.every((item) => {
            const bodyCartItemIds = item.cartItemIds
            return bodyCartItemIds.every((cartItemId) => {
              // Neu đã đến bước này thì cartItem luôn luôn có giá trị
              // Vì chúng ta đã so sánh với allBodyCartItems.length ở trên rồi
              const cartItem = cartItemMap.get(cartItemId)!
              return item.shopId === cartItem.sku.createdById
            })
          })
          if (!isValidShop) {
            throw SKUNotBelongToShopException
          }

          // 5. Tạo order và xóa cartItem trong transaction để đảm bảo tính toàn vẹn dữ liệu

          const payment = await tx.payment.create({
            data: {
              status: PaymentStatus.PENDING,
            },
          })
          const orders: CreateOrderResType['orders'] = []
          for (const item of body) {
            const order = await tx.order.create({
              data: {
                userId,
                status: OrderStatus.PENDING_PAYMENT,
                receiver: item.receiver,
                createdById: userId,
                shopId: item.shopId,
                paymentId: payment.id,
                items: {
                  create: item.cartItemIds.map((cartItemId) => {
                    const cartItem = cartItemMap.get(cartItemId)!
                    return {
                      productName: cartItem.sku.product.name,
                      skuPrice: cartItem.sku.price,
                      image: cartItem.sku.image,
                      skuId: cartItem.sku.id,
                      skuValue: cartItem.sku.value,
                      quantity: cartItem.quantity,
                      productId: cartItem.sku.product.id,
                      productTranslations: cartItem.sku.product.productTranslations.map((translation) => {
                        return {
                          id: translation.id,
                          name: translation.name,
                          description: translation.description,
                          languageId: translation.languageId,
                        }
                      }),
                    }
                  }),
                },
                products: {
                  connect: item.cartItemIds.map((cartItemId) => {
                    const cartItem = cartItemMap.get(cartItemId)!
                    return {
                      id: cartItem.sku.product.id,
                    }
                  }),
                },
              },
            })
            orders.push(order as any)
          }

          await tx.cartItem.deleteMany({
            where: {
              id: {
                in: allBodyCartItemIds,
              },
            },
          })
          for (const item of cartItems) {
            await tx.sKU
              .update({
                where: {
                  id: item.sku.id,
                  updatedAt: item.sku.updatedAt, // Đảm bảo không có ai cập nhật SKU trong khi chúng ta đang xử lý
                  stock: {
                    gte: item.quantity, // Đảm bảo số lượng tồn kho đủ để trừ
                  },
                },
                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              })
              .catch((e) => {
                if (isNotFoundPrismaError(e)) {
                  throw VersionConflictException
                }
                throw e
              })
          }
          await this.orderProducer.addCancelPaymentJob(payment.id)
          return [payment.id, orders]
        },
      )

      return {
        paymentId,
        orders,
      }
    } finally {
      // Giải phóng lock
      await Promise.all(locks.map((lock) => lock.release().catch(() => {})))
    }
  }

  async detail(userId: number, orderid: number): Promise<GetOrderDetailResType> {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderid,
        userId,
        deletedAt: null,
      },
      include: {
        items: true,
      },
    })
    if (!order) {
      throw OrderNotFoundException
    }
    return order as any
  }

  async cancel(userId: number, orderId: number): Promise<CancelOrderResType> {
    try {
      const order = await this.prismaService.order.findUniqueOrThrow({
        where: {
          id: orderId,
          userId,
          deletedAt: null,
        },
      })
      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw CannotCancelOrderException
      }
      const updatedOrder = await this.prismaService.order.update({
        where: {
          id: orderId,
          userId,
          deletedAt: null,
        },
        data: {
          status: OrderStatus.CANCELLED,
          updatedById: userId,
        },
      })
      return updatedOrder as any
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw OrderNotFoundException
      }
      throw error
    }
  }
}
