# Email + Newsletter Setup - Fiz Cap

This document explains how to configure the mail system for Fiz Cap so transactional emails and newsletter subscriptions work correctly.

## What this covers

- SMTP setup for newsletter emails
- Environment variables required by the app
- Supabase newsletter table integration
- Newsletter subscription flow in the code
- How to test the setup

## Relevant files

- `lib/email/gmail-smtp.ts`
- `app/actions/newsletter.ts`
- `components/newsletter-signup.tsx`
- `components/products/product-details.tsx`
- `lib/email/resend.tsx` (used for order emails)

## Email path used by newsletter subscriptions

The newsletter feature uses SMTP email sending via `lib/email/gmail-smtp.ts`.

- `app/actions/newsletter.ts` validates subscriber emails, stores them in Supabase, and sends:
  - a welcome email to the subscriber using `generateNewsletterWelcomeEmail`
  - an admin notification using `generateNewsletterAdminNotificationEmail`
- The signup form is in `components/newsletter-signup.tsx`
- The SMTP helper creates a transporter using one of these credentials:
  - `GMAIL_USER` / `GMAIL_APP_PASSWORD`
  - `SMTP_USER` / `SMTP_PASS`

## Required environment variables

Add these values to `.env.local` for local development and to your host environment for production.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# SMTP email (preferred for newsletter flow)
GMAIL_USER=youremail@gmail.com
GMAIL_APP_PASSWORD=your-google-app-password

# (Alternative generic SMTP credentials)
SMTP_USER=smtp-user@example.com
SMTP_PASS=smtp-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_FROM="Fiz Cap <orders@fizcap.com>"

# Admin email used for newsletter notifications
ADMIN_EMAIL=admin@fizcap.com

# App URL used in email templates and links
NEXT_PUBLIC_SITE_URL=https://fizcap.com
```

### Notes

- `SMTP_HOST` defaults to `smtp.gmail.com` if not set.
- `SMTP_PORT` defaults to `587`.
- If using Gmail, you should use an App Password and set `GMAIL_APP_PASSWORD`.
- `SMTP_SECURE=true` should be used for port `465`; otherwise use `false` for port `587`.
- `SMTP_FROM` is optional and defaults to the configured SMTP user when not provided.

## Supabase newsletter table setup

The newsletter action writes into the `newsletter_subscribers` table.

If your database does not already contain this table, create it before using the newsletter signup flow.

Example SQL:

```sql
create table newsletter_subscribers (
  id uuid generated always as identity primary key,
  email text not null unique,
  status text not null default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Supabase permissions

The server action uses the Supabase service role key:

```ts
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

This means the table can be updated from server code regardless of row-level security.

If you want to allow the frontend to query newsletter subscribers later, ensure you configure RLS appropriately.

## How the newsletter flow works

1. The user enters their email in `components/newsletter-signup.tsx`.
2. The form calls the server action `subscribeToNewsletter` from `app/actions/newsletter.ts`.
3. The action normalizes and validates the email.
4. It checks `newsletter_subscribers`:
   - if the email already exists and is active, it returns a success message
   - if the email exists but is inactive, it reactivates the record
   - otherwise it inserts a new subscriber row
5. It sends a welcome email to the subscriber using `sendSmtpEmail`.
6. It optionally notifies the admin email using `sendSmtpEmail`.

## Useful env variables for full email system

This app also has a separate Resend-based email path for order notification emails. If you want full email support for orders too, add these variables:

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM="Fiz Cap <orders@fizcap.com>"
ADMIN_EMAIL=admin@fizcap.com
NEXT_PUBLIC_SITE_URL=https://fizcap.com
```

## Testing the setup

1. Start your app locally with `pnpm dev`.
2. Open the page containing the newsletter signup component.
3. Submit a test email address.
4. Confirm the frontend shows a success message.
5. Check the `newsletter_subscribers` table for the new record.
6. Verify the welcome email arrives in the inbox.
7. Verify the admin notification arrives at `ADMIN_EMAIL`.

## Troubleshooting

### If newsletter emails are not sending

- Confirm SMTP credentials are correct.
- Check `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE` values.
- If using Gmail, verify the app password is valid.
- Confirm `SMTP_FROM` is a valid sender address.
- Check your application logs for errors from `sendSmtpEmail`.

### If the subscriber record is not created

- Confirm `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set.
- Confirm the `newsletter_subscribers` table exists and is writable.
- Check Supabase function logs and row-level security rules.

### If the admin notification email is missing

- Confirm `ADMIN_EMAIL` is configured.
- Check that `sendSmtpEmail` returns `success: true` when sending to the admin.

## Customizing newsletter emails

Edit `lib/email/gmail-smtp.ts`:

- `generateNewsletterWelcomeEmail(email)` for the subscriber welcome message
- `generateNewsletterAdminNotificationEmail(email)` for the notification sent to admin

If you want a branded or more complex template, update the HTML returned by those functions.

## Summary

To make newsletter subscribing work:

- set up SMTP credentials in environment variables
- configure the newsletter subscriber table in Supabase
- ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present
- test by submitting the newsletter signup form

For shop order emails, the repo also supports Resend separately via `lib/email/resend.ts`.
