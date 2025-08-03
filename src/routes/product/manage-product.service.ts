import { ForbiddenException, Injectable } from '@nestjs/common'
import { ProductRepo } from './product.repo'
import { RoleName } from 'src/shared/constants/role.constant'
import { CreateProductBodyType, GetManageProductsQueryType, UpdateProductBodyType } from './product.model'
import { I18nContext } from 'nestjs-i18n'
import { NotFoundRecordException } from 'src/shared/error'
import { isNotFoundPrismaError } from 'src/shared/helpers'

@Injectable()
export class ManageProductService {
  constructor(private productRepo: ProductRepo) {}

  /**
   * Kiểm tra nếu người dùng không phải là người tạo sản phẩm hoặc admin thì không cho tiếp tục
   */
  validatePrivilege({
    userIdRequest,
    roleNameRequest,
    createdById,
  }: {
    userIdRequest: number
    roleNameRequest: string
    createdById: number | undefined | null
  }) {
    if (userIdRequest !== createdById && roleNameRequest !== RoleName.Admin) {
      throw new ForbiddenException()
    }
    return true
  }

  /**
   * @description: Xem danh sách sản phẩm của một shop, bắt buộc phải truyền query param là `createdById`
   */
  async list(props: { query: GetManageProductsQueryType; userIdRequest: number; roleNameRequest: string }) {
    this.validatePrivilege({
      userIdRequest: props.userIdRequest,
      roleNameRequest: props.roleNameRequest,
      createdById: props.query.createdById,
    })
    const data = await this.productRepo.list({
      page: props.query.page,
      limit: props.query.limit,
      languageId: I18nContext.current()?.lang as string,
      createdById: props.query.createdById,
      isPublic: props.query.IsPublic,
    })
    return data
  }

  async getDetail(props: { productId: number; userIdRequest: number; roleNameRequest: string }) {
    const product = await this.productRepo.getDetail({
      productId: props.productId,
      languageId: I18nContext.current()?.lang as string,
    })

    if (!product) {
      throw NotFoundRecordException
    }
    this.validatePrivilege({
      userIdRequest: props.userIdRequest,
      roleNameRequest: props.roleNameRequest,
      createdById: product.createdById,
    })
    return product
  }

  create({ data, createdById }: { data: CreateProductBodyType; createdById: number }) {
    return this.productRepo.create({
      createdById,
      data,
    })
  }

  async update({
    productId,
    data,
    updatedById,
    roleNameRequest,
  }: {
    productId: number
    data: UpdateProductBodyType
    updatedById: number
    roleNameRequest: string
  }) {
    const product = await this.productRepo.findById(productId)
    if (!product) {
      throw NotFoundRecordException
    }
    this.validatePrivilege({
      userIdRequest: updatedById,
      roleNameRequest,
      createdById: product.createdById,
    })
    try {
      const updatedProduct = await this.productRepo.update({
        id: productId,
        updatedById,
        data,
      })
      return updatedProduct
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  async delete({
    productId,
    deletedById,
    roleNameRequest,
  }: {
    productId: number
    deletedById: number
    roleNameRequest: string
  }) {
    const product = await this.productRepo.findById(productId)
    if (!product) {
      throw NotFoundRecordException
    }
    this.validatePrivilege({
      userIdRequest: deletedById,
      roleNameRequest,
      createdById: product.createdById,
    })
    try {
      await this.productRepo.delete({
        id: productId,
        deletedById,
      })
      return {
        message: 'Delete successfully',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
