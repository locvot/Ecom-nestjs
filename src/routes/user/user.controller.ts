import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { ZodResponse } from 'nestjs-zod'
import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetUserParamsDTO,
  GetUsersQueryDTO,
  GetUsersResDTO,
  UpdateUserBodyDTO,
} from 'src/routes/user/user.dto'
import { UserService } from 'src/routes/user/user.service'
import { ActiveRolePermissions } from 'src/shared/decorators/active-role-permissions.decorator'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { GetUserProfileResDTO, UpdateProfileResDTO } from 'src/shared/dtos/shared-user.dto'

@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodResponse({ type: GetUsersResDTO })
  list(@Query() query: GetUsersQueryDTO) {
    return this.userService.list({
      page: query.page,
      limit: query.limit,
    })
  }

  @Get(':userId')
  @ZodResponse({ type: GetUserProfileResDTO })
  findById(@Param() params: GetUserParamsDTO) {
    return this.userService.findById(params.userId)
  }

  @Post()
  @ZodResponse({ type: CreateUserResDTO })
  create(
    @Body() body: CreateUserBodyDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') roleName: string,
  ) {
    return this.userService.create({
      data: body,
      createdById: userId,
      createdByRoleName: roleName,
    })
  }

  @Put(':userId')
  @ZodResponse({ type: UpdateProfileResDTO })
  update(
    @Body() body: UpdateUserBodyDTO,
    @Param() params: GetUserParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') roleName: string,
  ) {
    return this.userService.update({
      data: body,
      id: params.userId,
      updatedById: userId,
      updatedByRoleName: roleName,
    })
  }

  @Delete(':userId')
  @ZodResponse({ type: MessageResDTO })
  delete(
    @Param() params: GetUserParamsDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') roleName: string,
  ) {
    return this.userService.delete({
      id: params.userId,
      deletedById: userId,
      deletedByRoleName: roleName,
    })
  }
}
