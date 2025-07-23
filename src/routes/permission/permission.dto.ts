import { createZodDto } from 'nestjs-zod'
import {
  CreatePermissionBodySchema,
  GetPermissionDetailResSchema,
  GetPermissionParamScehma,
  GetPermissionQuerySchema,
  GetPermissionResSchema,
} from './permission.model'

export class GetPermissionResDTO extends createZodDto(GetPermissionResSchema) {}

export class GetPermissionQueryDTO extends createZodDto(GetPermissionQuerySchema) {}

export class GetPermissionDetailResDTO extends createZodDto(GetPermissionDetailResSchema) {}

export class GetPermissionParamDTO extends createZodDto(GetPermissionParamScehma) {}

export class CreatePermissionBodyDTO extends createZodDto(CreatePermissionBodySchema) {}
