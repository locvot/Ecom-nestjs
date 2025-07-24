import { Injectable } from '@nestjs/common'
import { RoleRepo } from './role.repo'
import { GetRolesQueryType } from './role.model'

@Injectable()
export class RoleService {
  constructor(private roleRepo: RoleRepo) {}

  async list(pagination: GetRolesQueryType) {
    const data = await this.roleRepo.list(pagination)
    return data
  }
}
