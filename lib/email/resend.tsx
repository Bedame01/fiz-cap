import { Resend } from "resend"

// Initialize Resend client - gracefully handle missing API key
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface EmailOptions {
  to: string
  subject: string
  html: string
}

interface OrderConfirmationData {
  id: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  shippingAddress: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

interface AdminOrderNotificationData {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
}

/**
 * Send an email using Resend
 * Returns null on error to prevent order failures
 */
export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!resend) {
    console.log(" Resend not configured, skipping email")
    return null
  }

  try {
    const fromEmail = process.env.EMAIL_FROM || "Fiz Cap <onboarding@resend.dev>"

    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    })

    console.log(" Email sent successfully:", result)
    return result
  } catch (error) {
    console.error(" Failed to send email:", error)
    return null
  }
}

/**
 * Generate HTML for customer order confirmation email
 */
export function generateOrderConfirmationEmail(data: OrderConfirmationData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fizcap.com"
  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #000; color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">Fiz Cap</h1>
    <p style="margin: 10px 0 0; font-size: 14px; opacity: 0.9;">Premium Headwear - Fix your Fit</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #000; margin-top: 0;">Order Confirmation</h2>
    <p>Hi ${data.customerName},</p>
    <p>Thank you for your order! We've received your order and will process it shortly.</p>
    
    <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 10px;">Order Details</h3>
      <p><strong>Order ID:</strong> #${data.id.slice(0, 8).toUpperCase()}</p>
      
      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid #ddd;">
            <th style="text-align: left; padding: 10px 0;">Item</th>
            <th style="text-align: center; padding: 10px 0;">Qty</th>
            <th style="text-align: right; padding: 10px 0;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${data.items
            .map(
              (item) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0;">${item.name}</td>
              <td style="text-align: center; padding: 10px 0;">${item.quantity}</td>
              <td style="text-align: right; padding: 10px 0;">₦${(item.price / 100).toLocaleString()}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px 0; text-align: right;"><strong>Subtotal:</strong></td>
            <td style="text-align: right; padding: 10px 0;">₦${(subtotal / 100).toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 10px 0; text-align: right;"><strong>Total:</strong></td>
            <td style="text-align: right; padding: 10px 0; font-size: 18px;"><strong>₦${(data.total / 100).toLocaleString()}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Shipping Address</h3>
      <p style="margin: 5px 0;">${data.shippingAddress.address}</p>
      <p style="margin: 5px 0;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}</p>
      <p style="margin: 5px 0;">${data.shippingAddress.country}</p>
    </div>
    
    <div style="background: #000; color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 15px;">Track your order or contact us if you have any questions</p>
      <a href="${siteUrl}/account/orders" style="background: #fff; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Order</a>
    </div>
    
    <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
      Need help? Contact us at <a href="mailto:Fizayomi21@gmail.com" style="color: #000;">Fizayomi21@gmail.com</a>
    </p>
  </div>
</body>
</html>
  `
}

/**
 * Generate HTML for admin order notification email
 */
export function generateAdminOrderNotificationEmail(data: AdminOrderNotificationData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fizcap.com"
  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order - Admin Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1a1a1a; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">🎉 New Order Received!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
    <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; color: #000;">Order #${data.id.slice(0, 8).toUpperCase()}</h3>
      <p style="font-size: 20px; color: #000; margin: 10px 0;"><strong>Total: ₦${(data.total / 100).toLocaleString()}</strong></p>
    </div>
    
    <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 10px;">Customer Information</h3>
      <p><strong>Name:</strong> ${data.customerName}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}" style="color: #000;">${data.customerEmail}</a></p>
      <p><strong>Phone:</strong> ${data.customerPhone}</p>
    </div>
    
    <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 10px;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #ddd;">
            <th style="text-align: left; padding: 10px 0;">Product</th>
            <th style="text-align: center; padding: 10px 0;">Qty</th>
            <th style="text-align: right; padding: 10px 0;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${data.items
            .map(
              (item) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0;">${item.name}</td>
              <td style="text-align: center; padding: 10px 0;">${item.quantity}</td>
              <td style="text-align: right; padding: 10px 0;">₦${(item.price / 100).toLocaleString()}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px 0; text-align: right;"><strong>Total:</strong></td>
            <td style="text-align: right; padding: 10px 0; font-size: 18px;"><strong>₦${(data.total / 100).toLocaleString()}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${siteUrl}/admin/orders" style="background: #000; color: #fff; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Order in Admin</a>
    </div>
    
    <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
      This is an automated notification from Fiz Cap Admin System
    </p>
  </div>
</body>
</html>
  `
}