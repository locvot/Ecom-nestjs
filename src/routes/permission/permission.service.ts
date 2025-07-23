import { Injectable } from '@nestjs/common'
import { PermissionRepo } from './permission.repo'
import { GetPermissionQueryType } from './permission.model'
import { NotFoundRecordException } from 'src/shared/dtos/error'

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
}
