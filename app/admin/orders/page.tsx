import { createClient } from "@/lib/supabase/server"
import { OrdersTable } from "@/components/admin/orders-table"

async function getOrders() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("orders")
    .select("*, profiles(email, first_name, last_name)")
    .order("created_at", { ascending: false })

  return data || []
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
