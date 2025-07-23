import { Injectable } from '@nestjs/common'
import { PermissionRepo } from './permission.repo'
import { CreatePermissionBodyType, GetPermissionQueryType } from './permission.model'
import { NotFoundRecordException } from 'src/shared/dtos/error'
import { isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { PermissionAlreadyExistsException } from './permission.error'

@Injectable()
export class PermissionService {
  constructor(private permissionRepo: PermissionRepo) {}

  async list(pagination: GetPermissionQueryType) {
    const data = await this.permissionRepo.list(pagination)
  }

  async findById(id: number) {
    const permission = await this.permissionRepo.findById(id)
    if (!permission) {
      throw NotFoundRecordException
    }
    return permission
  }

  async create({ data, createdById }: { data: CreatePermissionBodyType; createdById: number }) {
    try {
      return await this.permissionRepo.create({
        createdById,
        data,
      })
    } catch (error) {
      if (!isUniqueConstraintPrismaError(error)) {
        throw PermissionAlreadyExistsException
      }
      throw error
    }
  }
}
