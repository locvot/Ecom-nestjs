import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { OrderService } from './order.service'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  cancelOrderBodyDTO,
  CancelOrderResDTO,
  CreateOrderBodyDTO,
  CreateOrderResDTO,
  GetOrderDetailResDTO,
  GetOrderListQueryDTO,
  GetOrderListResDTO,
  GetOrderParamsDTO,
} from './order.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ZodSerializerDto(GetOrderListResDTO)
  getCart(@ActiveUser('userId') userId: number, @Query() query: GetOrderListQueryDTO) {
    return this.orderService.list(userId, query)
  }

  @Post()
  @ZodSerializerDto(CreateOrderResDTO)
  create(@ActiveUser('userId') userId: number, @Body() body: CreateOrderBodyDTO) {
    return this.orderService.create(userId, body)
  }

  @Get(':orderId')
  @ZodSerializerDto(GetOrderDetailResDTO)
  detail(@ActiveUser('userId') userId: number, @Param() params: GetOrderParamsDTO) {
    return this.orderService.detail(userId, params.orderId)
  }

  @Put(':orderId')
  @ZodSerializerDto(CancelOrderResDTO)
  cancel(@ActiveUser('userId') userId: number, @Param() params: GetOrderParamsDTO, @Body() _: cancelOrderBodyDTO) {
    return this.orderService.detail(userId, params.orderId)
  }
}
