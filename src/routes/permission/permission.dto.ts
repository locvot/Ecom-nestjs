import { createZodDto } from 'nestjs-zod'
import { GetPermissionQuerySchema, GetPermissionResSchema } from './permission.model'

export class GetPermissionResDTO extends createZodDto(GetPermissionResSchema) {}

export class GetPermissionQueryDTO extends createZodDto(GetPermissionQuerySchema) {}
