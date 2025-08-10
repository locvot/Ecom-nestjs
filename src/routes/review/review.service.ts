import { Injectable } from '@nestjs/common'
import { ReviewRepo } from './review.repo'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { CreateReviewBodyType, UpdateReviewBodyType } from './review.model'

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepo) {}

  list(productId: number, pagination: PaginationQueryType) {
    return this.reviewRepository.list(productId, pagination)
  }

  create(userId: number, body: CreateReviewBodyType) {
    return this.reviewRepository.create(userId, body)
  }

  update({ userId, reviewId, body }: { userId: number; reviewId: number; body: UpdateReviewBodyType }) {
    return this.reviewRepository.update({
      userId,
      reviewId,
      body,
    })
  }
}
