import { createZodDto } from 'nestjs-zod'
import { GetUserParamsSchema, GetUsersQuerySchema, GetUsersResSchema } from './user.model'

export class GetUsersResDTO extends createZodDto(GetUsersResSchema) {}

export class GetUsersQueryDTO extends createZodDto(GetUsersQuerySchema) {}

export class GetUsersParamsDTO extends createZodDto(GetUserParamsSchema) {}
