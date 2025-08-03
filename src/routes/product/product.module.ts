import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { ProductTranslationModule } from './product-translation/product-translation.module'
import { ProductRepo } from './product.repo'

@Module({
  providers: [ProductService, ProductRepo],
  controllers: [ProductController],
})
export class ProductModule {}
