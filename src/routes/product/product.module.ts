import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { ProductTranslationModule } from './product-translation/product-translation.module'
import { ProductRepo } from './product.repo'
import { ManageProductService } from './manage-product.service'
import { ManageProductController } from './manage-product.controller'

@Module({
  providers: [ProductService, ProductRepo, ManageProductService],
  controllers: [ProductController, ManageProductController],
})
export class ProductModule {}
