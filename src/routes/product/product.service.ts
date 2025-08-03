import { Injectable } from '@nestjs/common'
import { CreateProductBodyType, GetProductsQueryType, UpdateProductBodyType } from './product.model'
import { ProductRepo } from './product.repo'
import { I18nContext } from 'nestjs-i18n'
import { NotFoundRecordException } from 'src/shared/error'
import { isNotFoundPrismaError } from 'src/shared/helpers'

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  async list(props: { query: GetProductsQueryType }) {
    const data = await this.productRepo.list({
      page: props.query.page,
      limit: props.query.limit,
      languageId: I18nContext.current()?.lang as string,
      isPublic: true,
      brandIds: props.query.brandIds,
      minPrice: props.query.minPrice,
      maxPrice: props.query.maxPrice,
      categories: props.query.categories,
      name: props.query.name,
      createdById: props.query.createdById,
    })
    return data
  }

  async getDetail(props: { productId: number }) {
    const product = await this.productRepo.getDetail({
      productId: props.productId,
      languageId: I18nContext.current()?.lang as string,
      isPublic: true,
    })
    if (!product) {
      throw NotFoundRecordException
    }
    return product
  }
}
