import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { sendEmail, generateOrderConfirmationEmail, generateAdminOrderNotificationEmail } from "@/lib/email/resend"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface OrderItem {
  product_id: string
  product_name: string
  variant_id: string | null
  variant_name: string | null
  quantity: number
  unit_price: number
}

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  notes: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reference, total_amount, shipping_info, items } = body as {
      reference: string
      total_amount: number
      shipping_info: ShippingInfo
      items: OrderItem[]
    }

    if (!reference || !total_amount || !shipping_info || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        status: "pending",
        total_amount,
        currency: "NGN",
        stripe_payment_intent_id: reference,
        shipping_address: {
          firstName: shipping_info.firstName,
          lastName: shipping_info.lastName,
          address: shipping_info.address,
          city: shipping_info.city,
          state: shipping_info.state,
          postalCode: shipping_info.postalCode,
          country: shipping_info.country,
          phone: shipping_info.phone,
          email: shipping_info.email,
        },
        items: items.map((item) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price,
        })),
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Order creation error:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      variant_id: item.variant_id,
      variant_name: item.variant_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }))

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("[v0] Order items creation error:", itemsError)
    }

    await supabaseAdmin.from("admin_notifications").insert({
      type: "order",
      title: "New Order Received",
      message: `Order from ${shipping_info.firstName} ${shipping_info.lastName} - ₦${(total_amount / 100).toLocaleString()}`,
      data: { order_id: order.id, reference },
      read: false,
    })

    Promise.all([
      // Send customer confirmation email
      sendEmail({
        to: shipping_info.email,
        subject: `Order Confirmation - Fiz Cap #${order.id.slice(0, 8).toUpperCase()}`,
        html: generateOrderConfirmationEmail({
          id: order.id,
          customerName: `${shipping_info.firstName} ${shipping_info.lastName}`,
          customerEmail: shipping_info.email,
          items: items.map((item) => ({
            name: item.product_name,
            quantity: item.quantity,
            price: item.unit_price,
          })),
          total: total_amount,
          shippingAddress: {
            address: shipping_info.address,
            city: shipping_info.city,
            state: shipping_info.state,
            postalCode: shipping_info.postalCode,
            country: shipping_info.country,
          },
        }),
      }),

      // Send admin notification email
      (async () => {
        const adminEmail = process.env.ADMIN_EMAIL
        if (adminEmail) {
          await sendEmail({
            to: adminEmail,
            subject: `New Order #${order.id.slice(0, 8).toUpperCase()} - ₦${(total_amount / 100).toLocaleString()}`,
            html: generateAdminOrderNotificationEmail({
              id: order.id,
              customerName: `${shipping_info.firstName} ${shipping_info.lastName}`,
              customerEmail: shipping_info.email,
              customerPhone: shipping_info.phone,
              items: items.map((item) => ({
                name: item.product_name,
                quantity: item.quantity,
                price: item.unit_price,
              })),
              total: total_amount,
            }),
          })
        }
      })(),
    ]).catch((emailError) => {
      // Log but don't fail the order
      console.error("[v0] Failed to send email notifications:", emailError)
    })

    return NextResponse.json({ success: true, order_id: order.id })
  } catch (error) {
    console.error("[v0] Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}