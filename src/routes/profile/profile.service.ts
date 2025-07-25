import { Injectable } from '@nestjs/common'
import { NotFoundRecordException } from 'src/shared/dtos/error'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'

@Injectable()
export class ProfileService {
  constructor(private readonly sharedUserRepository: SharedUserRepository) {}

  async getProfile(userId: number) {
    const user = await this.sharedUserRepository.findUniqueIncludeRolePermissions({
      id: userId,
      deletedAt: null,
    })

    if (!user) {
      throw NotFoundRecordException
    }
    return user
  }
}
