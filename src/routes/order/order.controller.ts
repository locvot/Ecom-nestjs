import { Controller, Get, Query } from '@nestjs/common'
import { OrderService } from './order.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { GetOrderListResDTO } from './order.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ZodSerializerDto(GetOrderListResDTO)
  getCart(@ActiveUser('userId') userId: number, @Query() query: GetOrderListResDTO) {
    return this.orderService.list(userId, query)
  }
}
