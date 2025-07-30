import { HttpException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { RolesService } from 'src/routes/auth/roles.service'
import { generateOTP, isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { HashingService } from 'src/shared/services/hashing.service'
import {
  DisableTwoFactorBodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOTPBodyType,
} from './auth.model'
import { AuthRepository } from './auth.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import ms from 'ms'
import envConfig from 'src/shared/config'
import { addMilliseconds } from 'date-fns'
import { TypeOfVerificationCode, TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant'
import { EmailService } from 'src/shared/services/email.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'
import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOTPException,
  InvalidOTPAndCodeException,
  InvalidOTPException,
  InvalidTOTPException,
  OTPExpiredException,
  RefreshTokenAlreadyUsedException,
  TOTPAlreadyEnaBledException,
  TOTPNotEnabledException,
  UnauthorizedAccessException,
} from './auth.error'
import { TwoFactorService } from 'src/shared/services/2fa.service'
import { InvalidPasswordException } from 'src/shared/dtos/error'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly twoFactorService: TwoFactorService,
  ) {}
  async validateVerificationCode({
    email,
    code,
    type,
  }: {
    email: string
    code: string
    type: TypeOfVerificationCodeType
  }) {
    const verificationCode = await this.authRepository.findUniqueVerificationCode({
      email_code_type: {
        email,
        code,
        type,
      },
    })
    if (!verificationCode) {
      throw InvalidOTPException
    }
    if (verificationCode.expiresAt < new Date()) {
      throw OTPExpiredException
    }
    return verificationCode
  }

  async register(body: RegisterBodyType) {
    try {
      await this.validateVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.REGISTER,
      })
      const clientRoleId = await this.rolesService.getClientRoleId()
      const hashedPassword = await this.hashingService.hash(body.password)
      const [user] = await Promise.all([
        this.authRepository.createUser({
          email: body.email,
          name: body.name,
          phoneNumber: body.phoneNumber,
          password: hashedPassword,
          roleId: clientRoleId,
        }),
        this.authRepository.deleteVerificationCode({
          email_code_type: {
            email: body.email,
            code: body.code,
            type: TypeOfVerificationCode.REGISTER,
          },
        }),
      ])
      return user
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException
      }
      throw error
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    // 1. Find user in db
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
      deletedAt: null,
    })
    if (body.type === TypeOfVerificationCode.REGISTER && user) {
      throw EmailAlreadyExistsException
    }
    if (body.type === TypeOfVerificationCode.FORGOT_PASSWORD && !user) {
      throw EmailNotFoundException
    }
    // 2. Generate OTP
    const code = generateOTP()
    await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN)),
    })
    // 3. Send OTP
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code,
    })
    if (error) {
      throw FailedToSendOTPException
    }
    return { message: 'Send OTP successfully' }
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    // 1. Get user info, check user input=
    const user = await this.authRepository.findUniqueUserIncludeRole({
      email: body.email,
      deletedAt: null,
    })

    if (!user) {
      throw EmailNotFoundException
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw InvalidPasswordException
    }

    // 2. If user enable 2FA, check 2FA TOTP or OTP Code (email)
    if (user.totpSecret) {
      if (!body.totpCode && !body.code) {
        throw InvalidOTPAndCodeException
      }

      if (body.totpCode) {
        const isValid = this.twoFactorService.verifyTOTP({
          email: user.email,
          secret: user.totpSecret,
          token: body.totpCode,
        })
        if (!isValid) {
          throw InvalidTOTPException
        }
      } else if (body.code) {
        await this.validateVerificationCode({
          email: user.email,
          code: body.code,
          type: TypeOfVerificationCode.LOGIN,
        })
      }
    }

    // 3. Create device
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
      lastActive: new Date(),
      isActive: true,
    })
    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name,
    })
    return tokens
  }

  // 4. Generate access token and refresh token
  async generateTokens({ userId, deviceId, roleId, roleName }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId,
        roleId,
        roleName,
      }),
      this.tokenService.signRefreshToken({
        userId,
      }),
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId,
    })
    return { accessToken, refreshToken }
  }

  async refreshToken({ refreshToken, userAgent, ip }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
    try {
      // 1. Verify refresh token if it is valid
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      // 2. Check refresh_token in db
      const refreshTokenInDb = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({
        token: refreshToken,
      })
      if (!refreshTokenInDb) {
        throw RefreshTokenAlreadyUsedException
      }
      // 3. Update device
      const {
        deviceId,
        user: {
          roleId,
          role: { name: roleName },
        },
      } = refreshTokenInDb
      const $updateDevice = this.authRepository.updateDevice(deviceId, { ip, userAgent })
      // 4. Delete old refreshToken
      const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
        token: refreshToken,
      })
      // 5. Generate new accessToken and refreshToken
      const $token = this.generateTokens({ userId, roleId, roleName, deviceId })
      const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $token])
      return tokens
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw UnauthorizedAccessException
    }
  }

  async logout(refreshToken: string) {
    try {
      // 1. Verify refresh token
      await this.tokenService.verifyRefreshToken(refreshToken)
      // 2. Delete refreshToken in database
      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
        token: refreshToken,
      })
      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, {
        isActive: false,
      })
      return { message: 'Logout successfully' }
    } catch (error) {
      // If the token has been refreshed, notify the user
      // their refresh token has been stolen
      if (isNotFoundPrismaError(error)) {
        throw RefreshTokenAlreadyUsedException
      }
      throw UnauthorizedAccessException
    }
  }

  async forgotPassword(body: ForgotPasswordBodyType) {
    const { email, code, newPassword } = body
    // 1. Verify email if it is in db
    const user = await this.sharedUserRepository.findUnique({
      email,
      deletedAt: null,
    })
    if (!user) {
      throw EmailNotFoundException
    }
    // 2. Verify OTP if it is valid
    await this.validateVerificationCode({
      email: body.email,
      code: body.code,
      type: TypeOfVerificationCode.FORGOT_PASSWORD,
    })
    // 3. Update new password and remove OTP
    const hashedPassword = await this.hashingService.hash(newPassword)
    await Promise.all([
      this.sharedUserRepository.update(
        { id: user.id, deletedAt: null },
        { password: hashedPassword, updatedById: user.id },
      ),
      this.authRepository.deleteVerificationCode({
        email_code_type: {
          email: body.email,
          code: body.code,
          type: TypeOfVerificationCode.FORGOT_PASSWORD,
        },
      }),
    ])
    return {
      message: 'Update new password',
    }
  }

  async setupTwoFactorAuth(userId: number) {
    // 1. Get user info, check existen of user and 2FA enable or not
    const user = await this.sharedUserRepository.findUnique({
      id: userId,
      deletedAt: null,
    })
    if (!user) {
      throw EmailNotFoundException
    }
    if (user.totpSecret) {
      throw TOTPAlreadyEnaBledException
    }
    // 2. Create secret and uri
    const { secret, uri } = this.twoFactorService.generateTOTPSecret(user.email)
    // 3. Update secret of user in db
    await this.sharedUserRepository.update({ id: userId, deletedAt: null }, { totpSecret: secret })
    // 4. Return secret and uri
    return {
      secret,
      uri,
    }
  }

  async disableTwoFactorAuth(data: DisableTwoFactorBodyType & { userId: number }) {
    const { userId, totpCode, code } = data
    // 1. Check user info
    const user = await this.sharedUserRepository.findUnique({ id: userId, deletedAt: null })
    if (!user) {
      throw EmailNotFoundException
    }
    if (!user.totpSecret) {
      throw TOTPNotEnabledException
    }

    // 2. Verify Totp
    if (totpCode) {
      const isValid = this.twoFactorService.verifyTOTP({
        email: user.email,
        secret: user.totpSecret,
        token: totpCode,
      })
      if (!isValid) {
        throw InvalidTOTPException
      }
    } else if (code) {
      // 3. Verify OTP email
      await this.validateVerificationCode({
        email: user.email,
        code,
        type: TypeOfVerificationCode.DISABLE_2FA,
      })
    }

    // 4. Update secret value to null
    await this.sharedUserRepository.update({ id: userId, deletedAt: null }, { totpSecret: null, updatedById: userId })
    return {
      message: 'Tắt 2FA thành công',
    }
  }
}
