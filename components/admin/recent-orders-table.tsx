"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { formatPrice } from "@/lib/types/product"
import { createClient } from "@/lib/supabase/client"

interface Order {
  id: string
  created_at: string
  status: string
  total_amount: number
  shipping_address: {
    firstName?: string
    lastName?: string
    email?: string
  } | null
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

function getFullName(order: Order): string {
  // First check shipping_address (for guest orders)
  if (order.shipping_address?.firstName || order.shipping_address?.lastName) {
    const firstName = order.shipping_address.firstName || ""
    const lastName = order.shipping_address.lastName || ""
    return `${firstName} ${lastName}`.trim() || "Guest"
  }
  // Fall back to profiles (for authenticated orders)
  if (order.profiles) {
    const firstName = order.profiles.first_name || ""
    const lastName = order.profiles.last_name || ""
    const fullName = `${firstName} ${lastName}`.trim()
    return fullName || order.profiles.email || "Guest"
  }
  return "Guest"
}

export function RecentOrdersTable({ orders: initialOrders }: RecentOrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const supabase = createClient()

  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  useEffect(() => {
    const channel = supabase
      .channel("recent-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        const newOrder = payload.new as Order
        setOrders((prev) => [newOrder, ...prev].slice(0, 5))
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload) => {
        const updatedOrder = payload.new as Order
        setOrders((prev) => prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  if (orders.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No orders yet</div>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">{getFullName(order)}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className={statusColors[order.status] || ""}>
              {order.status}
            </Badge>
            <span className="font-medium">{formatPrice(order.total_amount / 100)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
