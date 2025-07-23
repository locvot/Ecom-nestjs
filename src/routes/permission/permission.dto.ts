import { createZodDto } from 'nestjs-zod'
import {
  CreatePermissionBodySchema,
  GetPermissionDetailResSchema,
  GetPermissionParamsScehma,
  GetPermissionQuerySchema,
  GetPermissionResSchema,
  UpdatePermissionBodySchema,
} from './permission.model'

export class GetPermissionResDTO extends createZodDto(GetPermissionResSchema) {}

export class GetPermissionQueryDTO extends createZodDto(GetPermissionQuerySchema) {}

export class GetPermissionDetailResDTO extends createZodDto(GetPermissionDetailResSchema) {}

export class GetPermissionParamsDTO extends createZodDto(GetPermissionParamsScehma) {}

export class CreatePermissionBodyDTO extends createZodDto(CreatePermissionBodySchema) {}

export class UpdatePermissionBodyDTO extends createZodDto(UpdatePermissionBodySchema) {}
