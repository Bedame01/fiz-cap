import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Orders",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-6">
          You have not placed any orders yet. Start shopping to see your orders here.
        </p>
        <Button asChild>
          <Link href="/shop">
            Start Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const orderItems = order.items as Array<{ name: string; quantity: number; price: number }>
        const orderNumber =
          order.stripe_checkout_session_id?.slice(-8).toUpperCase() || order.id.slice(0, 8).toUpperCase()

        return (
          <div key={order.id} className="bg-card rounded-lg border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Order #{orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>

            <div className="divide-y">
              {orderItems?.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: order.currency || "usd",
                    }).format((item.price || 0) / 100)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4 flex justify-between font-medium">
              <span>Total</span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: order.currency || "usd",
                }).format((order.total_amount || 0) / 100)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
