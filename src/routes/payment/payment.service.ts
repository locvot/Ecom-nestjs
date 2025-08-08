import { Injectable } from '@nestjs/common'
import { PaymentRepo } from './payment.repo'
import { WebhookPaymentBodyType } from './payment.model'
import { PaymentProducer } from './payment.producer'

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepo) {}

  async receiver(body: WebhookPaymentBodyType) {
    const result = await this.paymentRepo.receiver(body)
    return result
  }
}
