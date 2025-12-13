# Fiz Cap - Complete Application Documentation

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Authentication](#authentication)
7. [Admin Panel](#admin-panel)
8. [Shop Features](#shop-features)
9. [Payment Integration](#payment-integration)
10. [AI Image Generation](#ai-image-generation)
11. [Environment Variables](#environment-variables)
12. [Deployment](#deployment)

---

## Overview

Fiz Cap is a full-stack e-commerce application for a premium headwear brand. Built with Next.js 15 and Supabase, it features a customer-facing shop, admin dashboard, AI-powered image generation, and Paystack payment integration.

### Key Features

- Product catalog with categories, variants, and images
- Shopping cart with persistent storage
- Secure checkout with Paystack
- Admin dashboard with real-time notifications
- AI-powered product image generation
- Store location management
- Contact form with admin messaging
- Dark/Light theme support
- Responsive design for all devices

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Supabase** | Database, authentication, real-time |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **Paystack** | Payment processing (NGN) |
| **Pollinations AI** | Free AI image generation |
| **Vercel Blob** | Image storage |

---

## Project Structure

\`\`\`
fiz-cap/
├── app/
│   ├── (main)/                 # Public-facing pages
│   │   ├── page.tsx            # Homepage
│   │   ├── shop/               # Shop & product listing
│   │   ├── products/[slug]/    # Product detail pages
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow
│   │   ├── account/            # User account
│   │   ├── contact/            # Contact form
│   │   └── stores/             # Store locations
│   ├── admin/                  # Admin dashboard
│   │   ├── page.tsx            # Dashboard home
│   │   ├── products/           # Product management
│   │   ├── orders/             # Order management
│   │   ├── categories/         # Category management
│   │   ├── customers/          # Customer management
│   │   ├── messages/           # Contact submissions
│   │   ├── stores/             # Store locations
│   │   ├── settings/           # Store settings
│   │   └── login/              # Admin authentication
│   ├── api/                    # API routes
│   │   ├── admin/setup/        # Admin user setup
│   │   ├── generate-cap-image/ # AI image generation
│   │   ├── orders/create/      # Order creation
│   │   └── paystack/verify/    # Payment verification
│   └── actions/                # Server actions
│       └── contact.ts          # Contact form submission
├── components/
│   ├── admin/                  # Admin components
│   ├── cart/                   # Cart components
│   ├── checkout/               # Checkout components
│   ├── contact/                # Contact form
│   ├── layout/                 # Header, footer, providers
│   ├── products/               # Product display components
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── supabase/               # Supabase clients
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Auth middleware helper
│   └── types/                  # TypeScript types
│       └── product.ts          # Product & cart types
├── scripts/                    # SQL migration scripts
└── docs/                       # Documentation
\`\`\`

---

## Database Schema

### Tables Overview

#### `profiles`
User profiles linked to Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | References auth.users |
| email | text | User email |
| first_name | text | First name |
| last_name | text | Last name |
| phone | text | Phone number |
| role | text | 'customer' or 'admin' |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

#### `categories`
Product categories.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Category ID |
| name | text | Category name |
| slug | text (unique) | URL-friendly slug |
| description | text | Category description |
| image_url | text | Category image |
| sort_order | integer | Display order |
| created_at | timestamptz | Creation timestamp |

#### `products`
Product catalog.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Product ID |
| name | text | Product name |
| slug | text (unique) | URL-friendly slug |
| description | text | Full description |
| short_description | text | Brief description |
| price | numeric(10,2) | Price in Naira |
| compare_at_price | numeric(10,2) | Original price (for sales) |
| sku | text (unique) | Stock keeping unit |
| inventory_quantity | integer | Stock count |
| category_id | uuid (FK) | References categories |
| style | text | Cap style type |
| material | text | Material composition |
| brand | text | Brand name |
| color | text | Primary color |
| featured | boolean | Show on homepage |
| status | text | 'active', 'draft', 'archived' |
| tags | text[] | Product tags |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

#### `product_images`
Product image gallery.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Image ID |
| product_id | uuid (FK) | References products |
| url | text | Image URL |
| alt_text | text | Alt text for accessibility |
| position | integer | Display order |
| created_at | timestamptz | Creation timestamp |

#### `product_variants`
Product variations (size, color).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Variant ID |
| product_id | uuid (FK) | References products |
| size | text | Size option |
| color | text | Color option |
| sku | text (unique) | Variant SKU |
| price_adjustment | numeric(10,2) | Price modifier |
| inventory_quantity | integer | Variant stock |
| created_at | timestamptz | Creation timestamp |

#### `orders`
Customer orders.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Order ID |
| user_id | uuid (FK) | References profiles (nullable for guests) |
| status | text | 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled' |
| total_amount | integer | Total in kobo |
| currency | text | Currency code (NGN) |
| shipping_address | jsonb | Shipping details |
| billing_address | jsonb | Billing details |
| items | jsonb | Order items backup |
| stripe_payment_intent_id | text | Paystack reference |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

#### `order_items`
Individual items within orders.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Item ID |
| order_id | uuid (FK) | References orders |
| product_id | uuid (FK) | References products |
| variant_id | uuid (FK) | References product_variants |
| product_name | text | Product name snapshot |
| variant_name | text | Variant name snapshot |
| quantity | integer | Quantity ordered |
| unit_price | numeric(10,2) | Price per unit |
| total_price | numeric(10,2) | Line total |
| created_at | timestamptz | Creation timestamp |

#### `contact_submissions`
Customer contact messages.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Submission ID |
| name | text | Customer name |
| email | text | Customer email |
| subject | text | Message subject |
| message | text | Message content |
| status | text | 'new', 'read', 'replied', 'archived' |
| created_at | timestamptz | Submission timestamp |

#### `store_locations`
Physical store locations.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Store ID |
| name | text | Store name |
| address | text | Street address |
| city | text | City |
| state | text | State/Province |
| country | text | Country |
| postal_code | text | ZIP/Postal code |
| phone | text | Contact phone |
| latitude | double precision | GPS latitude |
| longitude | double precision | GPS longitude |
| hours | jsonb | Operating hours |
| is_active | boolean | Active status |
| created_at | timestamptz | Creation timestamp |

#### `store_settings`
Global store configuration.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Settings ID |
| store_name | text | Store name |
| store_email | text | Contact email |
| store_description | text | Store description |
| flat_shipping_rate | numeric | Shipping cost |
| free_shipping_threshold | numeric | Free shipping minimum |
| international_shipping | boolean | Allow international |
| low_stock_threshold | integer | Low stock alert level |
| notify_new_orders | boolean | Order notifications |
| notify_low_stock | boolean | Stock notifications |
| notify_contact_form | boolean | Message notifications |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

#### `admin_notifications`
Real-time admin notifications.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Notification ID |
| type | text | 'order', 'contact', etc. |
| title | text | Notification title |
| message | text | Notification content |
| data | jsonb | Additional data |
| read | boolean | Read status |
| created_at | timestamptz | Creation timestamp |

---

## API Reference

### POST `/api/admin/setup`

Create or update admin user profile.

**Request Body:**
\`\`\`json
{
  "userId": "uuid",
  "email": "admin@example.com"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

---

### POST `/api/generate-cap-image`

Generate AI product images using Pollinations AI.

**Request Body:**
\`\`\`json
{
  "prompt": "custom details",
  "style": "snapback",
  "color": "black",
  "material": "cotton",
  "displayMode": "product" | "model" | "lifestyle",
  "modelType": "male" | "female" | "neutral"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "imageUrl": "https://image.pollinations.ai/...",
  "isPlaceholder": false,
  "prompt": "generated prompt",
  "message": "Image generated successfully"
}
\`\`\`

---

### POST `/api/orders/create`

Create a new order with items.

**Request Body:**
\`\`\`json
{
  "reference": "paystack_reference",
  "total_amount": 2500000,
  "shipping_info": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+234...",
    "address": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "postalCode": "100001",
    "country": "Nigeria",
    "notes": ""
  },
  "items": [
    {
      "product_id": "uuid",
      "product_name": "Classic Snapback",
      "variant_id": null,
      "variant_name": null,
      "quantity": 2,
      "unit_price": 12500
    }
  ]
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "order_id": "uuid"
}
\`\`\`

---

### GET `/api/paystack/verify?reference={reference}`

Verify Paystack payment transaction.

**Response:**
\`\`\`json
{
  "status": true,
  "message": "Verification successful",
  "data": {
    "status": "success",
    "amount": 2500000,
    "reference": "..."
  }
}
\`\`\`

---

### Server Action: `submitContactForm`

Submit contact form message.

**Parameters:**
\`\`\`typescript
{
  name: string
  email: string
  subject: string
  message: string
}
\`\`\`

**Returns:**
\`\`\`typescript
{ success: true } | { success: false, error: string }
\`\`\`

---

## Authentication

Fiz Cap uses Supabase Auth with email/password authentication.

### User Roles

- **customer** - Default role for registered users
- **admin** - Full access to admin dashboard

### Protected Routes

| Route | Access |
|-------|--------|
| `/account/*` | Authenticated users |
| `/admin/*` | Admin users only |
| `/checkout` | Public (guest checkout supported) |

### Admin Setup

1. Navigate to `/admin/login`
2. If no admin exists, a setup form appears
3. Create account with email/password
4. Profile is automatically set to `role: 'admin'`

---

## Admin Panel

### Dashboard (`/admin`)

- Revenue statistics with period comparison
- Order count and customer metrics
- Recent orders table with real-time updates
- Sales chart with historical data

### Products (`/admin/products`)

- Product listing with search and filters
- Create/Edit products with:
  - Basic info (name, description, price)
  - Category assignment
  - Inventory management
  - Variant management (size, color)
  - Image gallery with AI generation
  - Featured product toggle

### Orders (`/admin/orders`)

- Order listing with status filters
- Order details with customer info
- Status management (pending → delivered)
- Real-time new order notifications

### Categories (`/admin/categories`)

- Category CRUD operations
- Image upload support
- Sort order management

### Customers (`/admin/customers`)

- Customer listing from profiles
- Order history per customer

### Messages (`/admin/messages`)

- Contact form submissions
- Status management (new, read, replied)
- Quick reply functionality

### Stores (`/admin/stores`)

- Store location management
- Address and coordinates
- Operating hours
- Active/inactive status

### Settings (`/admin/settings`)

- Store information
- Shipping configuration
- Notification preferences

---

## Shop Features

### Product Listing (`/shop`)

- Grid/List view toggle
- Category filtering
- Price range filtering
- Style filtering
- Search functionality
- Sort options (price, name, date)

### Product Detail Page (`/products/[slug]`)

- Image carousel with thumbnails
- Product information
- Size/Color variant selection
- Quantity selector
- Add to cart functionality
- Related products

### Shopping Cart

- Persistent cart (localStorage)
- Quantity adjustment
- Remove items
- Subtotal calculation
- Shipping estimation
- VAT calculation (7.5%)

### Checkout (`/checkout`)

- Guest checkout supported
- Shipping information form
- Order summary
- Paystack payment integration
- Order confirmation page

---

## Payment Integration

### Paystack Setup

Fiz Cap uses Paystack for payment processing in Nigerian Naira (NGN).

**Required Environment Variables:**
\`\`\`env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
\`\`\`

### Payment Flow

1. Customer completes shipping form
2. Order created with 'pending' status
3. Paystack popup initiated
4. Customer completes payment
5. Paystack webhook/redirect triggers verification
6. Order status updated to 'confirmed'
7. Admin notification created
8. Customer redirected to success page

### Supported Payment Methods

- Card payments (Visa, Mastercard, Verve)
- Bank transfer
- USSD
- Mobile money

---

## AI Image Generation

### Pollinations AI Integration

Fiz Cap uses Pollinations AI for free, unlimited product image generation.

**Features:**
- No API key required
- Three display modes:
  - **Product** - Clean e-commerce shots
  - **Model** - Virtual models wearing caps
  - **Lifestyle** - Contextual lifestyle shots
- Customizable prompts
- Multiple image generation

### Usage in Admin

1. Navigate to product form
2. Click "AI Generate" tab in image section
3. Select display mode and options
4. Click "Generate Image"
5. Select generated images to add to product

---

## Environment Variables

### Required Variables

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
\`\`\`

### Optional Variables

\`\`\`env
# Vercel Blob (for image uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

---

## Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy

### Database Setup

Run SQL scripts in order:

\`\`\`bash
001_create_tables.sql        # Core tables
002_profile_trigger.sql      # Auto profile creation
003_seed_stores.sql          # Sample store data
007_create_store_settings.sql # Store settings table
008_fix_categories_rls.sql   # Category RLS policies
009_fix_admin_rls_policies.sql # Admin access policies
010_store_locations_admin_rls.sql # Store location policies
\`\`\`

### Post-Deployment

1. Access `/admin/login`
2. Create first admin account
3. Configure store settings
4. Add categories and products
5. Test checkout flow with Paystack test mode

---

## Support

For technical support or questions:

- **Documentation**: `/docs` folder
- **GitHub Issues**: Report bugs and feature requests
- **Email**: support@fizcap.com

---

*Fiz Cap - Cap Your Style*

Version 1.0.0 | Last Updated: December 2025
