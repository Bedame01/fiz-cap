"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { CartProvider } from "@/components/cart/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Toaster } from "sonner"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CartProvider>
        {children}
        <CartDrawer />
        <Toaster position="top-right" richColors closeButton />
      </CartProvider>
    </ThemeProvider>
  )
}
