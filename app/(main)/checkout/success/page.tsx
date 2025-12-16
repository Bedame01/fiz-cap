import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/types/product"

interface SuccessPageProps {
  searchParams: Promise<{ reference?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const reference = params.reference

  if (!reference) {
    return (
      <main className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Order</h1>
          <p className="text-muted-foreground mb-8">No order reference found.</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    )
  }

  // Fetch order from database
  const supabase = await createClient()
  const { data: order } = await supabase.from("orders").select("*").eq("stripe_payment_intent_id", reference).single()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const orderNumber = reference.slice(-8).toUpperCase()
  const shippingAddress = order?.shipping_address as any

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold tracking-tight mb-2">Thank you for your order!</h1>
          <p className="text-muted-foreground mb-8">We have received your order and are getting it ready.</p>

          {/* Order Details Card */}
          <div className="bg-card rounded-lg border p-6 text-left mb-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-mono font-medium">#{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{order?.status || "Confirmed"}</p>
              </div>
            </div>

            {/* Order Items */}
            {order?.items && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="space-y-2">
                  {(order.items as any[]).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} {item.variant_name && `(${item.variant_name})`} x {item.quantity}
                      </span>
                      <span className="font-medium">{formatPrice((item.price / 100) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t mt-4 pt-4 flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice((order?.total_amount || 0) / 100)}</span>
            </div>

            {/* Shipping Address */}
            {shippingAddress && (
              <div className="border-t mt-4 pt-4">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-sm text-muted-foreground">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                  <br />
                  {shippingAddress.address}
                  <br />
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.country}
                  <br />
                  {shippingAddress.phone}
                </p>
              </div>
            )}
          </div>

          {/* Delivery Info */}
          <div className="bg-secondary/50 rounded-lg p-4 mb-8 flex items-center gap-3">
            <Package className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-left">
              <span className="font-medium">Estimated Delivery: </span>
              <span className="text-muted-foreground">
                3-5 business days. You will receive a shipping confirmation email with tracking information.
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user && (
              <Button variant="outline" asChild className="py-5.5">
                <Link href="/account/orders">View Orders</Link>
              </Button>
            )}
            <Button asChild className="py-5.5">
              <Link href="/shop">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
