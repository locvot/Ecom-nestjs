import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from '../config'
import fs from 'fs'
import path from 'path'

const otpTemplate = fs.readFileSync(path.resolve('src/shared/email-templates/otp.html'), {
  encoding: 'utf-8',
})

@Injectable()
export class EmailService {
  private resend: Resend
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  sendOTP(payload: { email: string; code: string }) {
    const subject = 'OTP code'
    return this.resend.emails.send({
      from: 'Ecom <onboarding@resend.dev>',
      to: [payload.email],
      subject,
      html: otpTemplate.replaceAll('{{subject}}', subject).replaceAll('{{code}}', payload.code),
    })
  }
}
