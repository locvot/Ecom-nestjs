import { Module } from '@nestjs/common'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'
import { CartRepo } from './cart.repo'

@Module({
  providers: [CartService, CartRepo],
  controllers: [CartController],
})
export class CartModule {}
