import { Global, Module } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { HashingService } from './services/hashing.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { PaymentAPIKeyGuard } from 'src/shared/guards/payment-api-key.guard'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { EmailService } from 'src/shared/services/email.service'
import { TwoFactorService } from 'src/shared/services/2fa.service'
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repo'
import { S3Service } from 'src/shared/services/s3.service'
import { SharedPaymentRepository } from 'src/shared/repositories/shared-payment.repo'
import { SharedWebsocketRepository } from 'src/shared/repositories/shared-websocket.repo'

const sharedServices = [
  PrismaService,
  HashingService,
  TokenService,
  EmailService,
  SharedUserRepository,
  TwoFactorService,
  SharedRoleRepository,
  SharedPaymentRepository,
  SharedWebsocketRepository,
  S3Service,
]

@Global()
@Module({
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    PaymentAPIKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
