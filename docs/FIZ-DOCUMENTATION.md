# FIZ-CAP E-Commerce Platform Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Authentication](#authentication)
6. [Features](#features)
7. [Theme System](#theme-system)
8. [Environment Variables](#environment-variables)
9. [Deployment](#deployment)

---

## Overview

FIZ-CAP is a modern, full-stack e-commerce platform specializing in premium caps and headwear. Built with Next.js 15, Supabase, and Stripe, it offers a seamless shopping experience with user authentication, shopping cart, secure checkout, and an admin dashboard.

### Key Features
- **Product Catalog** - Browse caps by style (Snapbacks, Fitted, Dad Hats, Trucker, Beanies, Bucket Hats)
- **Shopping Cart** - Persistent cart with real-time updates
- **Secure Checkout** - Stripe integration for payments
- **User Accounts** - Authentication, order history, profile management
- **Admin Dashboard** - Product management, order tracking, analytics
- **Store Locator** - Find physical store locations
- **Dark Mode** - System-aware theme switching

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS v4** | Utility-first styling |
| **Supabase** | PostgreSQL database & authentication |
| **Stripe** | Payment processing |
| **next-themes** | Dark/light mode support |
| **Lucide React** | Icon library |
| **shadcn/ui** | UI component library |

---

## Project Structure

\`\`\`
├── app/                      # Next.js App Router
│   ├── (main)/              # Main layout group
│   │   ├── page.tsx         # Homepage
│   │   ├── shop/            # Product catalog
│   │   ├── product/[slug]/  # Product details
│   │   ├── account/         # User account pages
│   │   ├── checkout/        # Checkout flow
│   │   ├── stores/          # Store locator
│   │   └── contact/         # Contact page
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   │   ├── checkout/        # Stripe checkout session
│   │   └── webhook/stripe/  # Stripe webhooks
│   └── auth/                # Auth callback routes
├── components/
│   ├── layout/              # Header, Footer, Providers
│   ├── cart/                # Cart components
│   ├── products/            # Product cards, filters
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase/            # Supabase client utilities
│   ├── stripe.ts            # Stripe configuration
│   └── utils.ts             # Utility functions
├── docs/                    # Documentation
└── scripts/                 # Database migration scripts
\`\`\`

---

## Database Schema

### Tables

#### `profiles`
Stores user profile information linked to Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (references auth.users) |
| email | text | User email |
| first_name | text | First name |
| last_name | text | Last name |
| phone | text | Phone number |
| role | text | 'customer' or 'admin' |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### `categories`
Product categories for organizing caps.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Category name |
| slug | text | URL-friendly identifier |
| description | text | Category description |
| image_url | text | Category image |
| sort_order | integer | Display order |
| created_at | timestamptz | Creation timestamp |

**Seeded Categories:**
- Snapbacks
- Fitted Caps
- Dad Hats
- Trucker Caps
- Beanies
- Bucket Hats

#### `products`
Main product table.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Product name |
| slug | text | URL-friendly identifier |
| description | text | Full description |
| short_description | text | Brief description |
| price | numeric(10,2) | Product price |
| compare_at_price | numeric(10,2) | Original price (for sales) |
| sku | text | Stock keeping unit |
| inventory_quantity | integer | Stock count |
| category_id | uuid | Foreign key to categories |
| style | text | Cap style type |
| material | text | Material composition |
| brand | text | Brand name (default: FIZ-CAP) |
| color | text | Primary color |
| featured | boolean | Featured product flag |
| status | text | 'active', 'draft', 'archived' |
| tags | text[] | Product tags |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### `product_images`
Product image gallery.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| product_id | uuid | Foreign key to products |
| url | text | Image URL |
| alt_text | text | Alt text for accessibility |
| position | integer | Display order |
| created_at | timestamptz | Creation timestamp |

#### `product_variants`
Product size/color variants.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| product_id | uuid | Foreign key to products |
| size | text | Size option |
| color | text | Color option |
| sku | text | Variant SKU |
| price_adjustment | numeric(10,2) | Price difference |
| inventory_quantity | integer | Variant stock |
| created_at | timestamptz | Creation timestamp |

#### `orders`
Customer orders.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| order_number | text | Human-readable order ID |
| stripe_payment_intent_id | text | Stripe payment reference |
| stripe_checkout_session_id | text | Stripe session reference |
| status | text | Order status |
| subtotal | numeric(10,2) | Subtotal amount |
| shipping_cost | numeric(10,2) | Shipping charges |
| tax | numeric(10,2) | Tax amount |
| total | numeric(10,2) | Total amount |
| currency | text | Currency code |
| shipping_address | jsonb | Shipping details |
| billing_address | jsonb | Billing details |
| customer_email | text | Customer email |
| customer_name | text | Customer name |
| notes | text | Order notes |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

**Order Statuses:** pending, processing, shipped, delivered, cancelled, refunded

#### `order_items`
Individual items in an order.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| order_id | uuid | Foreign key to orders |
| product_id | uuid | Foreign key to products |
| variant_id | uuid | Foreign key to variants |
| product_name | text | Product name snapshot |
| variant_name | text | Variant name snapshot |
| quantity | integer | Quantity ordered |
| unit_price | numeric(10,2) | Price per item |
| total_price | numeric(10,2) | Line total |
| created_at | timestamptz | Creation timestamp |

#### `contact_submissions`
Contact form submissions.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Submitter name |
| email | text | Submitter email |
| subject | text | Message subject |
| message | text | Message content |
| status | text | 'new', 'read', 'replied', 'archived' |
| created_at | timestamptz | Creation timestamp |

#### `store_locations`
Physical store information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Store name |
| address | text | Street address |
| city | text | City |
| state | text | State/Province |
| country | text | Country |
| postal_code | text | ZIP/Postal code |
| phone | text | Phone number |
| latitude | float | GPS latitude |
| longitude | float | GPS longitude |
| hours | jsonb | Operating hours |
| is_active | boolean | Active status |
| created_at | timestamptz | Creation timestamp |

**Seeded Locations:**
- FIZ-CAP Flagship (New York, NY)
- FIZ-CAP LA (Los Angeles, CA)
- FIZ-CAP Chicago (Chicago, IL)
- FIZ-CAP Miami (Miami, FL)

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Public Read**: Categories, products (active only), product images, variants, store locations
- **Own Data**: Users can read/update their own profiles and orders
- **Admin Access**: Full access to all tables for admin users
- **Anonymous Insert**: Contact submissions allow anonymous inserts

---

## Authentication

### Supabase Auth
- Email/password authentication
- Automatic profile creation via database trigger
- Session management with cookie-based tokens

### Auth Flow
1. User signs up/in via `/account/login` or `/account/register`
2. Supabase creates auth.users entry
3. Database trigger creates profiles entry
4. Middleware refreshes session tokens
5. Protected routes check auth state

### Admin Access
- Role stored in `profiles.role` column
- Admin users see admin link in header
- Admin routes protected by role check
- Promote users via: `SELECT promote_to_admin('email@example.com');`

---

## Features

### Shopping Cart
- Client-side state with localStorage persistence
- Real-time quantity updates
- Slide-out drawer UI
- Syncs across tabs

### Checkout
1. Cart review page
2. Stripe Checkout redirect
3. Webhook processes successful payments
4. Order created in database
5. Success page with order confirmation

### Product Catalog
- Filter by style, category, price range
- Sort by price, name, newest
- Responsive grid layout
- Image gallery with zoom

### User Account
- Profile management
- Order history
- Wishlist (coming soon)
- Address book (coming soon)

### Admin Dashboard
- Product CRUD operations
- Order management
- Customer list
- Analytics (coming soon)

---

## Theme System

### Dark Mode Support
The app supports light, dark, and system themes using `next-themes`.

#### Configuration
\`\`\`tsx
// components/layout/providers.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
\`\`\`

#### Theme Toggle
The `ThemeToggle` component in the header allows users to switch between themes:
- Sun icon: Switch to light mode
- Moon icon: Switch to dark mode
- Respects system preference by default

#### CSS Variables
Theme colors are defined in `app/globals.css`:
- `:root` - Light mode colors
- `.dark` - Dark mode colors

All components use semantic color tokens (`bg-background`, `text-foreground`, etc.) that automatically adjust based on the active theme.

---

## Environment Variables

### Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

### Development Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Auth redirect URL for development |

---

## Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Database Setup
Run migration scripts in order:
1. `001_create_tables.sql` - Core tables
2. `002_profile_trigger.sql` - Auth trigger
3. `003_seed_categories.sql` - Category data
4. `004_seed_products.sql` - Product data
5. `005_seed_stores.sql` - Store locations

### Stripe Setup
1. Create Stripe account
2. Configure webhook endpoint: `/api/webhook/stripe`
3. Add webhook secret to environment variables
4. Create products in Stripe Dashboard or via API

---

## API Routes

### POST `/api/checkout`
Creates a Stripe Checkout session.

**Request Body:**
\`\`\`json
{
  "items": [
    {
      "id": "product-id",
      "name": "Product Name",
      "price": 29.99,
      "quantity": 1,
      "image": "/image.jpg"
    }
  ]
}
\`\`\`

### POST `/api/webhook/stripe`
Handles Stripe webhook events:
- `checkout.session.completed` - Creates order record

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following existing patterns
4. Submit a pull request

---

## License

MIT License - See LICENSE file for details.

---

*Last updated: November 2025*
