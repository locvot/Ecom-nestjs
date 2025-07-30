import { createZodDto } from 'nestjs-zod'
import { GetUsersQuerySchema, GetUsersResSchema } from './user.model'

export class GetUsersResDTO extends createZodDto(GetUsersResSchema) {}

export class GetUsersQueryDTO extends createZodDto(GetUsersQuerySchema) {}
