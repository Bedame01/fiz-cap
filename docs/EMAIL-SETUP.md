# Email Notifications Setup - Fiz Cap

This document explains how to set up email notifications for order confirmations and admin notifications using Resend.

## Overview

Fiz Cap uses **Resend** for sending transactional emails:
- **Customer Order Confirmations** - Sent automatically when an order is placed
- **Admin Order Notifications** - Sent to admin email address for new orders

## Why Resend?

- **Free Tier**: 3,000 emails/month free (100/day)
- **No Credit Card Required** for free tier
- **Fast & Reliable**: 99.9% uptime
- **Simple API**: Easy integration
- **Professional**: Built-in email templates

## Setup Instructions

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Key

1. Log in to your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "Fiz Cap Production")
5. Copy the API key (starts with `re_`)

### 3. Verify Domain (Optional but Recommended)

For production use, verify your domain to send from your own email address:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `fizcap.com`)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually takes a few minutes)

**Without domain verification**, emails will be sent from `onboarding@resend.dev` which works but looks less professional.

### 4. Configure Environment Variables

Add these environment variables to your Vercel project:

\`\`\`bash
# Required
RESEND_API_KEY=re_your_api_key_here

# Email sender address (use your verified domain or default)
EMAIL_FROM=Fiz Cap <orders@fizcap.com>

# Admin email for order notifications
ADMIN_EMAIL=admin@fizcap.com

# Your site URL for email links
NEXT_PUBLIC_SITE_URL=https://fizcap.com
\`\`\`

**In Vercel:**
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add each variable with appropriate values
4. Redeploy your application

### 5. Testing

Test email notifications:

1. **Place a test order** through checkout
2. Check the admin email inbox for notification
3. Check the customer email for order confirmation
4. View logs in Resend dashboard

**Check logs for debugging:**
- Vercel deployment logs show `[v0]` prefixed email status
- Resend dashboard shows all email delivery status

## Email Templates

### Customer Order Confirmation

Sent to customers when order is placed. Includes:
- Order number and items
- Total amount with breakdown
- Shipping address
- Link to track order
- Contact information

### Admin Order Notification

Sent to admin email for new orders. Includes:
- Customer information (name, email, phone)
- Order items and quantities
- Total amount
- Direct link to view order in admin panel

## Troubleshooting

### Emails Not Sending

1. **Check API Key** - Ensure `RESEND_API_KEY` is set correctly
2. **Check Console Logs** - Look for `[v0]` prefixed errors in deployment logs
3. **Verify Resend Dashboard** - Check if requests are hitting Resend API
4. **Check Spam Folder** - Emails might be filtered as spam initially

### Console Messages

The app logs email status:
\`\`\`
[v0] Email sent successfully: { id: '...' }
[v0] Resend not configured, skipping email
[v0] Failed to send email: [error details]
\`\`\`

### Orders Still Work Without Email

The app is designed to not fail orders if email fails. Orders are created successfully even if email delivery fails, ensuring no lost sales.

## Free Tier Limits

Resend free tier includes:
- **3,000 emails/month**
- **100 emails/day**
- **No credit card required**

Monitor usage in Resend dashboard. Upgrade to paid plan if you exceed limits.

## Email Best Practices

1. **Test thoroughly** before going live
2. **Monitor deliverability** in Resend dashboard
3. **Add SPF/DKIM records** for better delivery rates (provided by Resend)
4. **Keep templates professional** and mobile-responsive
5. **Include unsubscribe links** for marketing emails (not required for transactional)

## Support

- **Resend Documentation**: [resend.com/docs](https://resend.com/docs)
- **Resend Support**: support@resend.com
- **Fiz Cap Issues**: Check deployment logs and Resend dashboard

## Cost Estimate

For a small to medium shop:
- **Under 3,000 orders/month**: FREE
- **3,000-10,000 orders/month**: $20/month
- **10,000-50,000 orders/month**: $50/month

Most shops stay on the free tier comfortably.
\`\`\`

```json file="" isHidden
