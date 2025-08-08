import { Module } from '@nestjs/common'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { OrderRepo } from './order.repo'
import { BullModule } from '@nestjs/bullmq'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payment',
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepo],
})
export class OrderModule {}
