import { Injectable } from '@nestjs/common'
import { ProductTranslationRepo } from './product-translation.repo'
import { NotFoundRecordException } from 'src/shared/error'
import { CreateProductTranslationBodyType, UpdateProductTranslationBodyType } from './product-translation.model'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { ProductTranslationAlreadyExistException } from './product-translation.error'

@Injectable()
export class ProductTranslationService {
  constructor(private productTranslationRepo: ProductTranslationRepo) {}

  async findById(id: number) {
    const product = await this.productTranslationRepo.findById(id)
    if (!product) {
      throw NotFoundRecordException
    }
    return product
  }

  async create({ data, createdById }: { data: CreateProductTranslationBodyType; createdById: number }) {
    try {
      return await this.productTranslationRepo.create({ data, createdById })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductTranslationAlreadyExistException
      }
      throw error
    }
  }

  async update({ id, data, updatedById }: { id: number; updatedById: number; data: UpdateProductTranslationBodyType }) {
    try {
      const product = await this.productTranslationRepo.update({ id, data, updatedById })
      return product
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductTranslationAlreadyExistException
      }
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.productTranslationRepo.delete({
        id,
        deletedById,
      })
      return { message: 'Delete successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
