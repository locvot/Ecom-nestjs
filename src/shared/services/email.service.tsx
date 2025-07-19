import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from '../config'
import {OTPEmail} from 'emails/otp'
import * as React from 'react'

@Injectable()
export class EmailService {
  private resend: Resend
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  async sendOTP(payload: { email: string; code: string }) {
    const subject = 'OTP code'
    return this.resend.emails.send({
      from: 'Ecom <onboarding@resend.dev>',
      to: [payload.email],
      subject,
      react: <OTPEmail otpCode={payload.code} title={subject} />,
    })
  }
}
