import { createZodDto } from 'nestjs-zod'
import { GetRolesQuerySchema, GetRolesResSchema } from './role.model'

export class GetRolesResDTO extends createZodDto(GetRolesResSchema) {}

export class GetRolesQueryDTO extends createZodDto(GetRolesQuerySchema) {}
