# FIZ-CAP - Next.js E-Commerce Application

A full-stack e-commerce application built with Next.js, featuring Supabase integration for products and cart management, Paystack for payments, and for authentication and database.

## Features

### Frontend
- **Clean, Minimalist Design** - Neutral color palette with modern typography
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Product Catalog** - Grid layout with filtering, sorting, and search
- **Product Detail Pages** - Image carousel, variant selection, quantity controls
- **Shopping Cart** - Persistent cart with Supabase integration
- **User Authentication** - Email/password + Google OAuth via Supabase
- **Account Dashboard** - Profile management and order history
- **Contact Form** - With validation and database storage
- **Store Locator** - Map visualization with store listings

### Backend
- **Supabase Integration** - Authentication and PostgreSQL database
- **Paystack Payments** - Embedded checkout with webhook handling
- **Row Level Security** - Secure database access policies

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Paystack

## Key Features Implementation

### Authentication
- Email/password authentication
- Google OAuth integration
- Password reset flow
- Protected routes via middleware

### Shopping Cart
- Persistent cart (localStorage + Supabase)
- Real-time cart updates
- Cart drawer and dedicated cart page

### Checkout
- Paystack Embedded Checkout
- Address collection (shipping + billing)
- Order creation on success
- Webhook handling for payment events

### Product Catalog
- Collection filtering
- Price sorting
- Search functionality
- Product variants

## License

MIT
\`\`\`
