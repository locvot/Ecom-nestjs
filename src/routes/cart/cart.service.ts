import { Injectable } from '@nestjs/common'
import { CartRepo } from './cart.repo'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { I18nContext } from 'nestjs-i18n'
import { AddToCartBodyType, DeleteCartBodyType, UpdateCartItemBodyType } from './cart.model'

@Injectable()
export class CartService {
  constructor(private readonly cartRepo: CartRepo) {}

  getCart(userId: number, query: PaginationQueryType) {
    return this.cartRepo.list({
      userId,
      languageId: I18nContext.current()?.lang as string,
      page: query.page,
      limit: query.limit,
    })
  }

  addToCart(userId: number, body: AddToCartBodyType) {
    return this.cartRepo.create(userId, body)
  }

  updateCartItem(cartItemId: number, body: UpdateCartItemBodyType) {
    return this.cartRepo.update(cartItemId, body)
  }

  async deleteCart(userId: number, body: DeleteCartBodyType) {
    const { count } = await this.cartRepo.delete(userId, body)
    return {
      message: `${count} item(s) deleted from cart`,
    }
  }
}
