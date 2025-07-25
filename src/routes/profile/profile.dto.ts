import { createZodDto } from 'nestjs-zod'
import { UpdateMeBodySchema } from './profile.model'

export class UpdateMeBodyDTO extends createZodDto(UpdateMeBodySchema) {}
