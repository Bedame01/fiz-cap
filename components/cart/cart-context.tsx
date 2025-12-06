"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode, useEffect, useRef } from "react"
import type { Product, ProductVariant, CartItem, Cart } from "@/lib/types/product"

const CART_STORAGE_KEY = "caphaus_cart"

interface CartContextType {
  cart: Cart
  isLoading: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => void
  updateItemQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const emptyCart: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
}

function calculateTotals(items: CartItem[]): Omit<Cart, "items"> {
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.product.price + (item.variant?.price_adjustment || 0)
    return sum + itemPrice * item.quantity
  }, 0)

  const shipping = subtotal >= 50000 ? 0 : 2500 // Free shipping over 50,000 NGN
  const tax = subtotal * 0.075 // 7.5% VAT
  const total = subtotal + shipping + tax

  return { subtotal, shipping, tax, total }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const pendingOpenRef = useRef(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setCart(parsed)
      }
    } catch (error) {
      console.error("Failed to load cart:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart, isLoading])

  useEffect(() => {
    if (pendingOpenRef.current) {
      pendingOpenRef.current = false
      setIsOpen(true)
    }
  })

  const addItem = useCallback((product: Product, variant?: ProductVariant | null, quantity = 1) => {
    setCart((prev) => {
      const itemId = variant ? `${product.id}-${variant.id}` : product.id
      const existingIndex = prev.items.findIndex((item) =>
        variant ? item.id === itemId : item.product.id === product.id && !item.variant,
      )

      let newItems: CartItem[]
      if (existingIndex >= 0) {
        newItems = prev.items.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        newItems = [...prev.items, { id: itemId, product, variant, quantity }]
      }

      return { items: newItems, ...calculateTotals(newItems) }
    })
    pendingOpenRef.current = true
  }, [])

  const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const newItems = prev.items.filter((item) => item.id !== itemId)
        return { items: newItems, ...calculateTotals(newItems) }
      }

      const newItems = prev.items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      return { items: newItems, ...calculateTotals(newItems) }
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => item.id !== itemId)
      return { items: newItems, ...calculateTotals(newItems) }
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart(emptyCart)
  }, [])

  const cartCount = useMemo(() => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart.items])

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        setIsOpen,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}