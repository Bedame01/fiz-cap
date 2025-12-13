import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp, TrendingDown, Banknote } from "lucide-react"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { SalesChart } from "@/components/admin/sales-chart"
import { formatPrice } from "@/lib/types/product"

async function getDashboardStats() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: ordersCount },
    { count: customersCount },
    { data: recentOrders },
    { data: allOrders },
    { count: lastMonthOrdersCount },
    { count: lastMonthCustomersCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabase
      .from("orders")
      .select("*, profiles(email, first_name, last_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("orders").select("total_amount, created_at, status"),
    // Last month orders for comparison
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString())
      .lt("created_at", new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()),
    // Last month customers
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer")
      .gte("created_at", new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString())
      .lt("created_at", new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()),
  ])

  // Calculate total revenue (total_amount is in kobo for Naira)
  const revenue = allOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
  const revenueInNaira = revenue / 100

  // Calculate monthly sales data for chart
  const monthlySales = new Array(12).fill(0)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  allOrders?.forEach((order) => {
    if (order.status !== "cancelled" && order.status !== "refunded") {
      const date = new Date(order.created_at)
      const month = date.getMonth()
      monthlySales[month] += (order.total_amount || 0) / 100
    }
  })

  const salesData = monthNames.map((name, index) => ({
    name,
    total: Math.round(monthlySales[index]),
  }))

  // Calculate percentage changes
  const currentMonthOrders = (ordersCount || 0) - (lastMonthOrdersCount || 0)
  const orderChange = lastMonthOrdersCount ? ((currentMonthOrders / lastMonthOrdersCount) * 100).toFixed(1) : "0"

  const currentMonthCustomers = (customersCount || 0) - (lastMonthCustomersCount || 0)
  const customerChange = lastMonthCustomersCount
    ? ((currentMonthCustomers / lastMonthCustomersCount) * 100).toFixed(1)
    : "0"

  return {
    productsCount: productsCount || 0,
    ordersCount: ordersCount || 0,
    customersCount: customersCount || 0,
    recentOrders: recentOrders || [],
    revenue: revenueInNaira,
    salesData,
    orderChange: Number(orderChange) >= 0 ? `+${orderChange}%` : `${orderChange}%`,
    customerChange: Number(customerChange) >= 0 ? `+${customerChange}%` : `${customerChange}%`,
    orderTrend: Number(orderChange) >= 0 ? "up" : "down",
    customerTrend: Number(customerChange) >= 0 ? "up" : "down",
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.revenue),
      icon: Banknote,
      change: stats.revenue > 0 ? "+100%" : "0%",
      trend: stats.revenue > 0 ? "up" : "down",
    },
    {
      title: "Total Orders",
      value: stats.ordersCount.toString(),
      icon: ShoppingCart,
      change: stats.orderChange,
      trend: stats.orderTrend,
    },
    {
      title: "Total Products",
      value: stats.productsCount.toString(),
      icon: Package,
      change: `${stats.productsCount}`,
      trend: "up",
    },
    {
      title: "Customers",
      value: stats.customersCount.toString(),
      icon: Users,
      change: stats.customerChange,
      trend: stats.customerTrend,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={stats.salesData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable orders={stats.recentOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}