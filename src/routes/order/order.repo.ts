import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { GetOrderListQueryType, GetOrderListResType } from './order.model'
import { Prisma } from '@prisma/client'

@Injectable()
export class OrderRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(userId: number, query: GetOrderListQueryType): Promise<GetOrderListResType> {
    const { page, limit, status } = query
    const skip = (page - 1) * limit
    const take = limit
    const where: Prisma.OrderWhereInput = {
      userId,
      status,
    }

    // Count total order
    const totalItem$ = this.prismaService.order.count({
      where,
    })

    // Get list order
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
    }
  }
}
