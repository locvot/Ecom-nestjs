import { Injectable } from '@nestjs/common'
import { RoleRepo } from './role.repo'
import { CreateRoleBodyType, GetRolesQueryType } from './role.model'
import { NotFoundRecordException } from 'src/shared/dtos/error'
import { isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { RoleAlreadyExistsException } from './role.error'

@Injectable()
export class RoleService {
  constructor(private roleRepo: RoleRepo) {}

  async list(pagination: GetRolesQueryType) {
    const data = await this.roleRepo.list(pagination)
    return data
  }

  async findById(id: number) {
    const role = await this.roleRepo.findById(id)
    if (!role) {
      throw NotFoundRecordException
    }
    return role
  }

  async create({ data, createdById }: { data: CreateRoleBodyType; createdById: number }) {
    try {
      const role = await this.roleRepo.create({
        createdById,
        data,
      })
      return role
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw RoleAlreadyExistsException
      }
      throw error
    }
  }
}
