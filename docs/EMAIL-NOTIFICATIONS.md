# Email Notifications Setup

Fiz Cap uses **Resend** for sending email notifications. Resend offers a generous free tier with **3,000 emails per month** and **100 emails per day**.

## Features

- **Customer Order Confirmations**: Automatically sent when an order is placed
- **Admin Order Notifications**: Alerts sent to admin email for new orders
- **Professional Templates**: Beautiful HTML emails with branding

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address
3. Navigate to **API Keys** in the dashboard
4. Click **Create API Key**
5. Copy your API key

### 2. Configure Environment Variables

Add these variables to your `.env.local` file:

\`\`\`env
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Email Settings
EMAIL_FROM=Fiz Cap <orders@fizcap.com>  # Your verified domain email
ADMIN_EMAIL=admin@fizcap.com            # Where admin notifications go
NEXT_PUBLIC_SITE_URL=https://fizcap.com # Your site URL
\`\`\`

### 3. Verify Your Domain (Optional but Recommended)

For production use, you should verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `fizcap.com`)
4. Add the provided DNS records to your domain provider
5. Wait for verification (usually takes a few minutes)

Once verified, you can send from `orders@fizcap.com` instead of the default Resend domain.

### 4. Test Email Sending

Test that emails are working:

1. Place a test order on your site
2. Check your email for the order confirmation
3. Check the admin email for the notification

## Email Templates

The app includes two email templates:

### Customer Order Confirmation

- Order details with items, quantities, and prices
- Shipping address
- Order tracking information
- Professional branding with Fiz Cap logo

### Admin Order Notification

- Quick order summary
- Customer contact information
- Direct link to view order in admin panel

## Free Tier Limits

Resend free tier includes:

- **3,000 emails/month**
- **100 emails/day**
- Unlimited domains
- Full API access
- Email analytics

For most small to medium e-commerce stores, this is sufficient. If you need more:

- **Pro Plan**: $20/month for 50,000 emails
- **Scale Plan**: Custom pricing for larger volumes

## Troubleshooting

### Emails not sending

1. Check that `RESEND_API_KEY` is set correctly
2. Verify your domain is verified (for production)
3. Check Resend dashboard for error logs
4. Ensure you haven't exceeded daily/monthly limits

### Emails going to spam

1. Verify your domain in Resend
2. Add SPF, DKIM, and DMARC records (Resend provides these)
3. Use a professional "from" email (e.g., `orders@fizcap.com`)

### Wrong email addresses

1. Update `EMAIL_FROM` for customer emails
2. Update `ADMIN_EMAIL` for admin notifications
3. Restart your development server after changes

## Customization

To customize email templates, edit:

- `lib/email/resend.ts` - Email generation functions
- Modify HTML templates to match your branding
- Add more email types (shipping, refunds, etc.)

## Alternative Email Services

If you prefer a different service, the email functions are abstracted in `lib/email/resend.ts`. You can replace Resend with:

- **SendGrid** - 100 emails/day free
- **Mailgun** - 5,000 emails/month free
- **AWS SES** - Very cheap, but requires AWS setup
- **Postmark** - 100 emails/month free

Just update the `sendEmail` function to use your preferred service's API.
