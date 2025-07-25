import { z } from 'zod'
import { UserSchema } from 'src/shared/models/shared-user.model'

export const UpdateMeBodySchema = UserSchema.pick({
  name: true,
  phoneNumber: true,
  avatar: true,
}).strict()

export type UpdateMeBodyType = z.infer<typeof UpdateMeBodySchema>
