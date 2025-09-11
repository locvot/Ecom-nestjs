import { UseGuards } from '@nestjs/common'
import { Args, Int, Query, Resolver } from '@nestjs/graphql'
import { GetProducts, GetProductsQuery } from 'src/routes/product/graphql/product.entity'
import { ManageProductService } from 'src/routes/product/manage-product.service'
import { ProductService } from 'src/routes/product/product.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { GqlThrottlerGuard } from 'src/shared/guards/gql-throttler.guard'

@Resolver()
@UseGuards(GqlThrottlerGuard)
@IsPublic()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [GetProducts], { name: 'products' })
  findAll(@Args() args: GetProductsQuery) {
    return this.productService.list({
      query: args,
    })
  }

  @Query(() => GetProducts, { name: 'product' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productService.getDetail({
      productId: id,
    })
  }
}
