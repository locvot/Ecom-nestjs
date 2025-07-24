import { createZodDto } from 'nestjs-zod'
import { GetRoleDetailResSchema, GetRoleParamsSchema, GetRolesQuerySchema, GetRolesResSchema } from './role.model'

export class GetRolesResDTO extends createZodDto(GetRolesResSchema) {}

export class GetRolesQueryDTO extends createZodDto(GetRolesQuerySchema) {}

export class GetRoleDetailResDTO extends createZodDto(GetRoleDetailResSchema) {}

export class GetRoleParamsDTO extends createZodDto(GetRoleParamsSchema) {}
