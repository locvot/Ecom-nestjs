import { Injectable } from '@nestjs/common'
import { NotFoundRecordException } from 'src/shared/dtos/error'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { UpdateMeBodyType } from './profile.model'
import { isUniqueConstraintPrismaError } from 'src/shared/helpers'

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

  async updateProfile({ userId, body }: { userId: number; body: UpdateMeBodyType }) {
    try {
      return await this.sharedUserRepository.update(
        {
          id: userId,
          deletedAt: null,
        },
        {
          ...body,
          updatedById: userId,
        },
      )
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
