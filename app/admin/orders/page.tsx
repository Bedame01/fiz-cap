import { createClient } from "@/lib/supabase/server"
import { OrdersTable } from "@/components/admin/orders-table"

async function getOrders() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  // Map orders to include customer info from shipping_address
  return (data || []).map((order) => ({
    ...order,
    profiles: order.shipping_address
      ? {
          email: order.shipping_address.email || "N/A",
          first_name: order.shipping_address.firstName || null,
          last_name: order.shipping_address.lastName || null,
        }
      : null,
  }))
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}
