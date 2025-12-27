"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  MessageSquare,
  Store,
  Settings,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"
import logoBlack from '@/public/icons/logoBlack.png'
import logoWhite from '@/public/icons/logoWhite.png'
import { useTheme } from "next-themes"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/stores", label: "Stores", icon: Store },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn("bg-background max-lg:fixed top-0 z-50! min-h-screen border-r flex flex-col transition-all duration-300", collapsed ? "w-16" : "w-64")}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <Link href="/admin" className="font-bold text-xl tracking-tight">
            <Image
              src={theme === "dark" ? logoWhite : logoBlack}
              alt="logo"
              className="w-23 h-auto"
            />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(collapsed && "mx-auto")}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
            collapsed && "justify-center",
          )}
        >
          <Store className="h-4 w-4" />
          {!collapsed && <span>View Store</span>}
        </Link>
      </div>
    </aside>
  )
}
