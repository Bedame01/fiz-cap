"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type { ShopifyCart } from "@/lib/shopify/types"
import { headers } from "next/headers"

export async function createCheckoutSession(cart: ShopifyCart) {
  const headersList = await headers()
  const origin = headersList.get("origin") || "http://localhost:3000"
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Convert Shopify cart lines to Stripe line items
  const lineItems = cart.lines.edges.map((edge) => {
    const line = edge.node
    const price = Number.parseFloat(line.merchandise.price.amount)

    return {
      price_data: {
        currency: line.merchandise.price.currencyCode.toLowerCase(),
        product_data: {
          name: line.merchandise.product.title,
          description: line.merchandise.title !== "Default Title" ? line.merchandise.title : undefined,
          images: line.merchandise.product.images.edges[0]?.node.url
            ? [line.merchandise.product.images.edges[0].node.url]
            : undefined,
        },
        unit_amount: Math.round(price * 100),
      },
      quantity: line.quantity,
    }
  })

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: lineItems,
    mode: "payment",
    return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    customer_email: user?.email || undefined,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "NL"],
    },
    billing_address_collection: "required",
    metadata: {
      cart_id: cart.id,
      user_id: user?.id || "guest",
    },
  })

  return session.client_secret
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  })

  return {
    id: session.id,
    status: session.status,
    customerEmail: session.customer_details?.email,
    shippingAddress: session.shipping_details?.address,
    amountTotal: session.amount_total,
    currency: session.currency,
    lineItems: session.line_items?.data || [],
  }
}
