import { Injectable } from '@nestjs/common'
import { OrderRepo } from './order.repo'
import { CreateOrderBodyType, GetOrderListQueryType } from './order.model'

@Injectable()
export class OrderService {
  constructor(private readonly orderRepo: OrderRepo) {}

  list(userId: number, query: GetOrderListQueryType) {
    return this.orderRepo.list(userId, query)
  }

  create(userId: number, body: CreateOrderBodyType) {
    return this.orderRepo.create(userId, body)
  }

  detail(userId: number, orderId: number) {
    return this.orderRepo.detail(userId, orderId)
  }

  cancel(userId: number, orderId: number) {
    return this.orderRepo.cancel(userId, orderId)
  }
}
