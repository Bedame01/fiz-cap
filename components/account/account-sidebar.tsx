"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { User, Package, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    href: "/account",
    label: "Profile",
    icon: User,
  },
  {
    href: "/account/orders",
    label: "Orders",
    icon: Package,
  },
]

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </Link>
      ))}
      <Button
        variant="ghost"
        className="w-full justify-start px-4 py-3 h-auto text-muted-foreground hover:text-foreground"
        onClick={handleSignOut}
      >
        <LogOut className="w-5 h-5 mr-3" />
        Sign Out
      </Button>
    </nav>
  )
}
