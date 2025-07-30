import { Injectable } from '@nestjs/common'
import { GetUsersQueryType } from './user.model'
import { UserRepo } from './user.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { NotFoundRecordException } from 'src/shared/error'

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepo,
    private sharedUserRepository: SharedUserRepository,
  ) {}

  list(pagination: GetUsersQueryType) {
    return this.userRepo.list(pagination)
  }

  async findById(id: number) {
    const user = await this.sharedUserRepository.findUniqueIncludeRolePermissions({
      id,
      deletedAt: null,
    })
    if (!user) {
      throw NotFoundRecordException
    }
    return user
  }
}
