import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { RolesService } from 'src/routes/auth/roles.service'
import { AuthRepository } from './auth.repo'
import { GoogleService } from './google.service'

@Module({
  providers: [AuthService, RolesService, AuthRepository, GoogleService],
  controllers: [AuthController],
})
export class AuthModule {}
