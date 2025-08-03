import { UnprocessableEntityException } from '@nestjs/common'

export const ProductTranslationAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'productId',
    message: 'Error.ProductTranslationAlreadyExists',
  },
])
