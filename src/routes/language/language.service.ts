import { Injectable } from '@nestjs/common'
import { LanguageRepo } from './language.repo'
import { NotFoundRecordException } from 'src/shared/dtos/error'
import { CreateLanguageBodyType, UpdateLanguageBodyType } from './language.model'
import { LanguageAlreadyExistsException } from './language.error'
import { isNotFoundPrismaError } from 'src/shared/helpers'

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepo: LanguageRepo) {}

  async findAll() {
    const data = await this.languageRepo.findAll()
    return { data, totalItems: data.length }
  }

  async findById(id: string) {
    const language = await this.languageRepo.findById(id)
    if (!language) {
      throw NotFoundRecordException
    }
    return language
  }

  async create({ data, createdById }: { data: CreateLanguageBodyType; createdById: number }) {
    try {
      return await this.languageRepo.create({
        createdById,
        data,
      })
    } catch (error) {
      throw LanguageAlreadyExistsException
    }
  }

  async update({ id, data, updatedById }: { id: string; data: UpdateLanguageBodyType; updatedById: number }) {
    try {
      const language = await this.languageRepo.update({
        id,
        updatedById,
        data,
      })
      return language
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
