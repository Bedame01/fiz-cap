import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get("reference")

  if (!reference) {
    return NextResponse.json({ status: false, message: "Reference is required" }, { status: 400 })
  }

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ status: false, message: "Payment configuration error" }, { status: 500 })
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    })

    const data = await response.json()

    if (data.status && data.data.status === "success") {
      // Update order status in database
      const supabase = await createClient()

      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_payment_intent_id", reference) // Reusing this field for Paystack reference

      // Create admin notification
      await supabase.from("admin_notifications").insert({
        type: "new_order",
        title: "New Order Received",
        message: `Order ${reference} has been paid successfully`,
        data: { reference, amount: data.data.amount / 100 },
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Paystack verification error:", error)
    return NextResponse.json({ status: false, message: "Verification failed" }, { status: 500 })
  }
}
