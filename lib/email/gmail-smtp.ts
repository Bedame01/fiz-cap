import nodemailer from "nodemailer"

interface SendSmtpEmailOptions {
  to: string
  subject: string
  html: string
}

function getSmtpConfig() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS

  if (!user || !pass) {
    return null
  }

  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  }
}

function getFromAddress() {
  return process.env.SMTP_FROM || process.env.GMAIL_USER || process.env.SMTP_USER || "Fiz Cap"
}

export async function sendSmtpEmail({ to, subject, html }: SendSmtpEmailOptions) {
  const config = getSmtpConfig()

  if (!config) {
    console.log("Gmail SMTP not configured, skipping email")
    return { success: false as const, error: "Email service is not configured" }
  }

  try {
    const transporter = nodemailer.createTransport(config)

    const result = await transporter.sendMail({
      from: getFromAddress(),
      to,
      subject,
      html,
    })

    console.log("Gmail SMTP email sent successfully:", result.messageId)
    return { success: true as const, messageId: result.messageId }
  } catch (error) {
    console.error("Failed to send Gmail SMTP email:", error)
    return { success: false as const, error: "Failed to send email" }
  }
}

export function generateNewsletterWelcomeEmail(email: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fizcap.com"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the FIZ CAP Crew</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #000; color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">Fiz Cap</h1>
    <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Premium Headwear - Fix your Fit</p>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #000; margin-top: 0;">Welcome to the FIZ CAP Crew!</h2>
    <p>Thanks for subscribing with <strong>${email}</strong>.</p>
    <p>You are now on the list for exclusive drops, early access to new releases, and member-only discounts on premium headwear.</p>

    <div style="background: #000; color: #fff; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 15px;">Explore the latest caps while you wait for your next drop alert.</p>
      <a href="${siteUrl}/shop" style="background: #fff; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Shop All Caps</a>
    </div>

    <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
      Need help? Contact us at <a href="mailto:Fizayomi21@gmail.com" style="color: #000;">Fizayomi21@gmail.com</a>
    </p>
  </div>
</body>
</html>
  `
}

export function generateNewsletterAdminNotificationEmail(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Newsletter Subscriber</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a1a1a; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">New FIZ CAP Crew Subscriber</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
    <p>A new user subscribed to the FIZ CAP Crew newsletter.</p>
    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #000;">${email}</a></p>
    <p style="color: #666; font-size: 12px; margin-top: 30px;">Automated notification from Fiz Cap</p>
  </div>
</body>
</html>
  `
}
