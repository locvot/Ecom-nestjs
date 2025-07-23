import { Controller, Get, Param, Query } from '@nestjs/common'
import { PermissionService } from './permission.service'
import {
  GetPermissionDetailResDTO,
  GetPermissionParamDTO,
  GetPermissionQueryDTO,
  GetPermissionResDTO,
} from './permission.dto'
import { ZodSerializerDto } from 'nestjs-zod'

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodSerializerDto(GetPermissionResDTO)
  list(@Query() query: GetPermissionQueryDTO) {
    return this.permissionService.list({
      page: query.page,
      limit: query.limit,
    })
  }

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDTO)
  findById(@Param() params: GetPermissionParamDTO) {
    return this.permissionService.findById(params.permissionId)
  }
}
