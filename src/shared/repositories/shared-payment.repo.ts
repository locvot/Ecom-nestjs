import { Injectable } from '@nestjs/common'
import { PrismaService } from '../services/prisma.service'
import { OrderStatus } from '../constants/order.constant'
import { PaymentStatus } from '../constants/payment.constant'

@Injectable()
export class SharedPaymentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async cancelPaymentAndOrder(paymentId: number) {
    const payment = await this.prismaService.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        orders: {
          include: { items: true },
        },
      },
    })
    if (!payment) {
      throw Error('Payment not found')
    }
    const { orders } = payment
    const productSKUSnapshot = orders.map((order) => order.items).flat()
    await this.prismaService.$transaction(async (tx) => {
      const updateOrder$ = tx.order.updateMany({
        where: {
          id: {
            in: orders.map((order) => order.id),
          },
        },
        data: {
          status: OrderStatus.CANCELLED,
        },
      })

      const updateSku$ = (await Promise.all(productSKUSnapshot.filter((item) => item.skuId))).map((item) =>
        tx.sKU.update({
          where: {
            id: item.skuId as number,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        }),
      )

      const updatePayment$ = tx.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: PaymentStatus.FAILED,
        },
      })
      return await Promise.all([updateOrder$, updateSku$, updatePayment$])
    })
  }
}
