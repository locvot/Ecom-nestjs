import { Injectable } from '@nestjs/common'
import { RoleRepo } from './role.repo'
import { GetRolesQueryType } from './role.model'
import { NotFoundRecordException } from 'src/shared/dtos/error'

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
}
