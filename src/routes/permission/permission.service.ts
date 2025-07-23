import { Injectable } from '@nestjs/common'
import { PermissionRepo } from './permission.repo'
import { GetPermissionQueryType } from './permission.model'

@Injectable()
export class PermissionService {
  constructor(private permissionRepo: PermissionRepo) {}

  async list(pagination: GetPermissionQueryType) {
    const data = await this.permissionRepo.list(pagination)
  }
}
