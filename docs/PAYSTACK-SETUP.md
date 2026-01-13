# Paystack Integration Setup

This document explains how to set up Paystack payment integration for the FIZ CAP e-commerce platform.

## Environment Variables

Add the following environment variables to your Vercel project:

### Required Variables

\`\`\`env
# Paystack Public Key (starts with pk_test_ or pk_live_)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx

# Paystack Secret Key (starts with sk_test_ or sk_live_)
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
\`\`\`

## Getting Your API Keys

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign up or log in to your account
3. Navigate to **Settings** > **API Keys & Webhooks**
4. Copy your **Test** keys for development or **Live** keys for production

## Features

### Supported Payment Methods
- **Card Payments** - Visa, Mastercard, Verve
- **Bank Transfer** - Direct bank transfer
- **USSD** - Mobile banking codes
- **Bank** - Pay via bank app

### Payment Flow

1. Customer fills shipping information
2. Customer clicks "Pay" button
3. Paystack popup appears with payment options
4. Customer completes payment
5. Transaction is verified on the server
6. Order status is updated in the database
7. Customer is redirected to success page

## Currency

The default currency is **Nigerian Naira (NGN)**. All amounts are processed in **kobo** (1 NGN = 100 kobo).

## Testing

Use these test cards for development:

| Card Number | CVV | Expiry | PIN | OTP |
|------------|-----|--------|-----|-----|
| 4084 0840 8408 4081 | 408 | Any future date | 0000 | 123456 |
| 5060 6666 6666 6666 6667 | 123 | Any future date | 1234 | 123456 |

## Webhook Setup (Optional)

For production, set up webhooks to receive payment notifications:

1. Go to **Settings** > **API Keys & Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/paystack/webhook`
3. Select events: `charge.success`, `transfer.success`

## Security Notes

- Never expose your **Secret Key** on the client side
- Always verify transactions on the server before fulfilling orders
- Use HTTPS in production
- Implement proper error handling for failed payments
\`\`\`

```tsx file="" isHidden
