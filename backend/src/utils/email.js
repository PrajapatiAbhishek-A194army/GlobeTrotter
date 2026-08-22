import nodemailer from 'nodemailer'

let transporter = null

export const getTransporter = async () => {
  if (transporter) return transporter

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else {
    // Development / fallback: creates an Ethereal test account if needed
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass',
      },
    })
  }

  return transporter
}

/**
 * Send 6-digit OTP email for password change / reset
 */
export const sendOtpEmail = async (toEmail, otpCode, firstName = 'Traveler') => {
  console.log(`\n========================================`)
  console.log(`🔐 [PASSWORD CHANGE OTP CODE]`)
  console.log(`   Recipient : ${toEmail}`)
  console.log(`   OTP Code  : >>> ${otpCode} <<<`)
  console.log(`   Expires   : 10 minutes`)
  console.log(`========================================\n`)

  try {
    const transport = await getTransporter()
    const info = await transport.sendMail({
      from: `"GlobeTrotter Security" <${process.env.SMTP_FROM || 'security@globetrotter.app'}>`,
      to: toEmail,
      subject: `Your GlobeTrotter Verification Code: ${otpCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #16a34a; margin: 0; font-size: 24px;">🌍 GlobeTrotter</h2>
            <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Account Security Verification</p>
          </div>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <p style="font-size: 13px; color: #166534; margin: 0 0 10px 0; font-weight: bold; text-transform: uppercase;">Your 6-Digit OTP Code</p>
            <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #15803d; font-family: monospace;">${otpCode}</span>
          </div>
          <p style="font-size: 14px; color: #374151; line-height: 1.5; margin: 0 0 12px 0;">Hello ${firstName},</p>
          <p style="font-size: 14px; color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">Use this single-use verification code to complete your password change. This code is valid for <strong>10 minutes</strong>.</p>
          <div style="font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 16px;">
            If you did not request this verification code, please ignore this email or contact security support immediately.
          </div>
        </div>
      `,
    })
    return info
  } catch (err) {
    // In local dev without SMTP server, the console log above ensures the OTP is visible
    return null
  }
}
