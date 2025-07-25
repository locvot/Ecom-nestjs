import { createZodDto } from 'nestjs-zod'
import { GetUserProfileResSchema } from '../models/shared-user.model'

export class GetUserProfileResDTO extends createZodDto(GetUserProfileResSchema) {}
