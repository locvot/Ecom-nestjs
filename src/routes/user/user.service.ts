import { ForbiddenException, Injectable } from '@nestjs/common'
import { CreateUserBodyType, GetUsersQueryType, UpdateUserBodyType } from './user.model'
import { UserRepo } from './user.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { NotFoundRecordException } from 'src/shared/error'
import { RoleName } from 'src/shared/constants/role.constant'
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repo'
import { HashingService } from 'src/shared/services/hashing.service'
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/helpers'
import { CannotUpdateOrDeleteYourselfException, RoleNotFoundException, UserAlreadyExistsException } from './user.error'

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepo,
    private hashingService: HashingService,
    private sharedUserRepository: SharedUserRepository,
    private sharedRoleRepository: SharedRoleRepository,
  ) {}

  // Check if user have permission to affect others
  // Only admin role have permissions to: create admin user, update roleId to admin, remove admin user
  private async verifyRole({ roleNameAgent, roleIdTarget }) {
    if (roleNameAgent === RoleName.Admin) {
      return true
    } else {
      // Check agent role, agent role must be different from admin role
      const adminRoleId = await this.sharedRoleRepository.getAdminRoleId()
      if (roleIdTarget === adminRoleId) {
        throw new ForbiddenException()
      }
      return true
    }
  }

  private verifyYourself({ userAgentId, userTargetId }: { userAgentId: number; userTargetId: number }) {
    if (userAgentId === userTargetId) {
      throw CannotUpdateOrDeleteYourselfException
    }
  }

  private async getRoleIdByUserId(userId: number) {
    const currentUser = await this.sharedUserRepository.findUnique({
      id: userId,
    })
    if (!currentUser) {
      throw NotFoundRecordException
    }
    return currentUser.roleId
  }

  list(pagination: GetUsersQueryType) {
    return this.userRepo.list(pagination)
  }

  async findById(id: number) {
    const user = await this.sharedUserRepository.findUniqueIncludeRolePermissions({
      id,
    })
    if (!user) {
      throw NotFoundRecordException
    }
    return user
  }

  async create({
    data,
    createdById,
    createdByRoleName,
  }: {
    data: CreateUserBodyType
    createdById: number
    createdByRoleName: string
  }) {
    try {
      // Only admin agent have permission to create user with admin role
      await this.verifyRole({ roleNameAgent: createdByRoleName, roleIdTarget: data.roleId })

      const hashedPassword = await this.hashingService.hash(data.password)

      const user = await this.userRepo.create({
        createdById,
        data: {
          ...data,
          password: hashedPassword,
        },
      })
      return user
    } catch (error) {
      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException
      }

      if (isUniqueConstraintPrismaError(error)) {
        throw UserAlreadyExistsException
      }
      throw error
    }
  }

  async update({
    id,
    data,
    updatedById,
    updatedByRoleName,
  }: {
    id: number
    data: UpdateUserBodyType
    updatedById: number
    updatedByRoleName: string
  }) {
    try {
      // Cant update yourself role
      this.verifyYourself({
        userAgentId: updatedById,
        userTargetId: id,
      })

      // Get the original roleId of the updated person to check if the updated person has the right to update
      // Do not use data.roleId because this data can be intentionally passed incorrectly.
      const roleIdTarget = await this.getRoleIdByUserId(id)
      await this.verifyRole({
        roleNameAgent: updatedByRoleName,
        roleIdTarget,
      })

      const updatedUser = await this.sharedUserRepository.update(
        { id },
        {
          ...data,
          updatedById,
        },
      )
      return updatedUser
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      if (isUniqueConstraintPrismaError(error)) {
        throw UserAlreadyExistsException
      }
      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException
      }
      throw error
    }
  }

  async delete({ id, deletedById, deletedByRolename }: { id: number; deletedById: number; deletedByRolename: string }) {
    try {
      this.verifyYourself({
        userAgentId: deletedById,
        userTargetId: id,
      })

      const roleIdTarget = await this.getRoleIdByUserId(id)
      await this.verifyRole({
        roleNameAgent: deletedByRolename,
        roleIdTarget,
      })

      await this.userRepo.delete({
        id,
        deletedById,
      })

      return {
        message: 'Delete successfully',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
