import { Injectable } from '@nestjs/common'
import { GetUsersQueryType } from './user.model'
import { UserRepo } from './user.repo'

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepo) {}

  list(pagination: GetUsersQueryType) {
    return this.userRepo.list(pagination)
  }
}
