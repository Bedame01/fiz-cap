# FIZ-CAP - Next.js E-Commerce Application

A full-stack e-commerce application built with Next.js, featuring Shopify integration for products and cart management, Stripe for payments, and Supabase for authentication and database.

## Features

### Frontend
- **Clean, Minimalist Design** - Neutral color palette with modern typography
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Product Catalog** - Grid layout with filtering, sorting, and search
- **Product Detail Pages** - Image carousel, variant selection, quantity controls
- **Shopping Cart** - Persistent cart with Shopify integration
- **User Authentication** - Email/password + Google OAuth via Supabase
- **Account Dashboard** - Profile management and order history
- **Contact Form** - With validation and database storage
- **Store Locator** - Map visualization with store listings

### Backend
- **Supabase Integration** - Authentication and PostgreSQL database
- **Stripe Payments** - Embedded checkout with webhook handling
- **Shopify Storefront API** - Product data and cart management
- **Row Level Security** - Secure database access policies

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **E-commerce**: Shopify Storefront API (GraphQL)

## Environment Variables

Required environment variables:

\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Shopify (optional - defaults to demo store)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=

# Development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=
\`\`\`

## Database Setup

Run the SQL scripts in the `/scripts` folder in order:

1. `001_create_tables.sql` - Creates profiles, orders, contact_submissions, and store_locations tables
2. `002_profile_trigger.sql` - Sets up auto-profile creation on user signup
3. `003_seed_stores.sql` - Seeds sample store locations

## Project Structure

\`\`\`
├── app/
│   ├── (main)/           # Main layout with header/footer
│   │   ├── page.tsx      # Homepage
│   │   ├── shop/         # Product listings
│   │   ├── products/     # Product detail pages
│   │   ├── cart/         # Shopping cart
│   │   ├── checkout/     # Stripe checkout
│   │   ├── collections/  # Collection listings
│   │   ├── contact/      # Contact form
│   │   └── stores/       # Store locator
│   ├── account/          # User account pages
│   ├── auth/             # Authentication pages
│   ├── actions/          # Server actions
│   └── api/              # API routes (webhooks)
├── components/
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   ├── contact/          # Contact form
│   ├── layout/           # Header, footer, providers
│   ├── products/         # Product-related components
│   ├── stores/           # Store locator components
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── shopify/          # Shopify API client
│   ├── supabase/         # Supabase clients
│   ├── stripe.ts         # Stripe client
│   └── utils.ts          # Utility functions
├── types/
│   └── database.ts       # Database types
└── scripts/              # SQL migration scripts
\`\`\`

## Key Features Implementation

### Authentication
- Email/password authentication
- Google OAuth integration
- Password reset flow
- Protected routes via middleware

### Shopping Cart
- Shopify Storefront API integration
- Persistent cart (localStorage + Shopify)
- Real-time cart updates
- Cart drawer and dedicated cart page

### Checkout
- Stripe Embedded Checkout
- Address collection (shipping + billing)
- Order creation on success
- Webhook handling for payment events

### Product Catalog
- Shopify product sync
- Collection filtering
- Price sorting
- Search functionality
- Product variants

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Deployment

Deploy to Vercel with the required environment variables configured. The Supabase and Stripe integrations can be connected directly through the Vercel dashboard.

## License

MIT
\`\`\`
