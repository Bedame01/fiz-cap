import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Order {
  id: string
  created_at: string
  status: string
  total_amount: number
  profiles: {
    email: string
    first_name: string | null
    last_name: string | null
  } | null
}

interface RecentOrdersTableProps {
  orders: Order[]
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

function getFullName(profile: Order["profiles"]): string {
  if (!profile) return "Guest"
  const firstName = profile.first_name || ""
  const lastName = profile.last_name || ""
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || profile.email || "Guest"
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  if (orders.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No orders yet</div>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">{getFullName(order.profiles)}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={statusColors[order.status] || ""}>
              {order.status}
            </Badge>
            <span className="font-medium">${(order.total_amount / 100).toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
