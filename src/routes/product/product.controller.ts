import { Controller, Get, Param, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ZodSerializerDto } from 'nestjs-zod'
import { GetProductParamsDTO, GetProductsQueryDTO, GetProductsResDTO, ProductDTO } from './product.dto'

@Controller('product')
@IsPublic()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ZodSerializerDto(GetProductsResDTO)
  list(@Query() query: GetProductsQueryDTO) {
    return this.productService.list({ query })
  }

  @Get(':productId')
  @ZodSerializerDto(ProductDTO)
  findById(@Param() params: GetProductParamsDTO) {
    return this.productService.getDetail({ productId: params.productId })
  }
}
