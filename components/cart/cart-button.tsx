"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"

export function CartButton() {
  const { setIsOpen, cartCount } = useCart()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => setIsOpen(true)}
      aria-label={`Open cart with ${cartCount} items`}
    >
      <ShoppingBag className="w-5 h-5" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Button>
  )
}
