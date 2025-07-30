import { Controller, Get, Param, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { GetUsersParamsDTO, GetUsersQueryDTO, GetUsersResDTO } from './user.dto'
import { GetUserProfileResDTO } from 'src/shared/dtos/shared-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetUsersResDTO)
  list(@Query() query: GetUsersQueryDTO) {
    return this.userService.list({
      page: query.page,
      limit: query.limit,
    })
  }

  @Get(':userId')
  @ZodSerializerDto(GetUserProfileResDTO)
  findById(@Param() params: GetUsersParamsDTO) {
    return this.userService.findById(params.userId)
  }
}
