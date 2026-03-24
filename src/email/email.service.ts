import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendOtpEmail(email: string, otp: string, name?: string): Promise<void> {
    try {
      const apiKey = process.env.BREVO_API_KEY;
      const senderEmail = process.env.BREVO_SENDER_EMAIL;
      const senderName = process.env.BREVO_SENDER_NAME || 'MyFinance';

      if (!apiKey || !senderEmail) {
        throw new Error('Missing Brevo configuration');
      }

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          sender: {
            email: senderEmail,
            name: senderName,
          },
          to: [{ email }],
          subject: `${otp} - Your MyFinance verification code`,
          htmlContent: this.buildTemplate(otp, name),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Brevo request failed with ${response.status}`);
      }

      this.logger.log(`OTP sent to ${email}`);
    } catch (err) {
      this.logger.error(`Failed to send OTP to ${email}: ${(err as Error).message}`);
      throw new Error('Failed to send email. Please check your Brevo configuration.');
    }
  }

  private buildTemplate(otp: string, name?: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px;background:#07071a;font-family:Arial,sans-serif;">
  <div style="max-width:460px;margin:0 auto;background:#111128;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

    <div style="background:linear-gradient(135deg,#818cf8,#6366f1);padding:24px 32px;text-align:center;">
      <div style="font-size:26px;font-weight:700;color:#fff;letter-spacing:-0.5px;">₹ MyFinance</div>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Personal Finance Tracker</p>
    </div>

    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;font-size:19px;color:#e8eaf6;">
        ${name ? `Hey ${name}, verify` : 'Verify'} your email
      </h2>
      <p style="margin:0 0 24px;color:#9496b8;font-size:14px;line-height:1.6;">
        Enter the code below to complete your registration.<br>
        <strong style="color:#e8eaf6;">This code expires in 10 minutes.</strong>
      </p>

      <div style="background:#07071a;border:1.5px solid rgba(129,140,248,0.4);border-radius:12px;padding:24px;text-align:center;">
        <span style="font-family:'Courier New',monospace;font-size:42px;font-weight:700;letter-spacing:14px;color:#818cf8;">${otp}</span>
      </div>

      <p style="margin:24px 0 0;color:#55577a;font-size:12px;text-align:center;line-height:1.5;">
        If you didn't request this code, you can safely ignore this email.<br>
        Do not share this code with anyone.
      </p>
    </div>

  </div>
</body>
</html>`;
  }
}
