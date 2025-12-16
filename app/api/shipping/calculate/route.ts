import { type NextRequest, NextResponse } from "next/server"
import { calculateShipping } from "@/lib/shipping/calculator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { state, subtotal, itemCount } = body

    if (!state || subtotal === undefined || itemCount === undefined) {
      return NextResponse.json({ error: "Missing required fields: state, subtotal, itemCount" }, { status: 400 })
    }

    const shipping = await calculateShipping(state, subtotal, itemCount)

    return NextResponse.json({
      success: true,
      shipping,
    })
  } catch (error) {
    console.error("[v0] Shipping calculation API error:", error)
    return NextResponse.json({ error: "Failed to calculate shipping" }, { status: 500 })
  }
}