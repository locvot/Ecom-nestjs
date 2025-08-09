import { Body, Controller, Post } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { WebhookPaymentBodyDTO } from './payment.dto'
import { ApiSecurity } from '@nestjs/swagger'

@Controller('payment')
@ApiSecurity('payment-api-key')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('receiver')
  @ZodSerializerDto(MessageResDTO)
  @Auth(['PaymentAPIKey'])
  receiver(@Body() body: WebhookPaymentBodyDTO) {
    return this.paymentService.receiver(body)
  }
}
