import { Injectable } from '@nestjs/common'
import { PaymentRepo } from './payment.repo'
import { WebhookPaymentBodyType } from './payment.model'
import { PaymentProducer } from './payment.producer'

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepo: PaymentRepo,
    private readonly paymentProducer: PaymentProducer,
  ) {}

  async receiver(body: WebhookPaymentBodyType) {
    const { paymentId, message } = await this.paymentRepo.receiver(body)
    await this.paymentProducer.removeJob(paymentId)
    return { message }
  }
}
