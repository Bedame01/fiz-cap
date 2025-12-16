"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode, useEffect, useRef } from "react"
import type { Product, ProductVariant, CartItem, Cart } from "@/lib/types/product"

const CART_STORAGE_KEY = "caphaus_cart"

interface AddItemResult {
  added: number
  available: number
  wasLimited: boolean
}

interface CartContextType {
  cart: Cart
  isLoading: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => AddItemResult
  updateItemQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  cartCount: number
  availabilityWarning: { message: string; available: number } | null
  clearAvailabilityWarning: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const emptyCart: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
}

interface StoredCartItem {
  id: string
  productId: string
  productName: string
  productPrice: number
  productSlug: string
  productImage?: string
  variantId?: string | null
  variantSize?: string | null
  variantColor?: string | null
  variantPriceAdjustment?: number
  quantity: number
}

function calculateTotals(items: CartItem[]): Omit<Cart, "items"> {
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.product.price + (item.variant?.price_adjustment || 0)
    return sum + itemPrice * item.quantity
  }, 0)

  const shipping = 0 // Free shipping over 50,000 NGN
  const tax = subtotal * 0.020 // 2.0% VAT
  const total = subtotal + shipping + tax

  return { subtotal, shipping, tax, total }
}

function toStoredItem(item: CartItem): StoredCartItem {
  return {
    id: item.id,
    productId: item.product.id,
    productName: item.product.name,
    productPrice: item.product.price,
    productSlug: item.product.slug,
    productImage: item.product.images?.[0]?.url,
    variantId: item.variant?.id,
    variantSize: item.variant?.size,
    variantColor: item.variant?.color,
    variantPriceAdjustment: item.variant?.price_adjustment,
    quantity: item.quantity,
  }
}

function fromStoredItem(stored: StoredCartItem): CartItem {
  const product: Product = {
    id: stored.productId,
    name: stored.productName,
    slug: stored.productSlug,
    price: stored.productPrice,
    images: stored.productImage ? [{ url: stored.productImage }] : [],
    inventory_quantity: 999, // Will be validated on checkout
  }

  const variant = stored.variantId
    ? {
        id: stored.variantId,
        product_id: stored.productId,
        size: stored.variantSize,
        color: stored.variantColor,
        price_adjustment: stored.variantPriceAdjustment || 0,
        inventory_quantity: 999,
      }
    : null

  return {
    id: stored.id,
    product,
    variant,
    quantity: stored.quantity,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [availabilityWarning, setAvailabilityWarning] = useState<{ message: string; available: number } | null>(null)
  const pendingOpenRef = useRef(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const storedItems: StoredCartItem[] = JSON.parse(stored)
        const cartItems = storedItems.map(fromStoredItem)
        const cartData = { items: cartItems, ...calculateTotals(cartItems) }
        setCart(cartData)
      }
    } catch (error) {
      console.error("[v0] Failed to load cart:", error)
      // Clear corrupted cart data
      localStorage.removeItem(CART_STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      try {
        const storedItems = cart.items.map(toStoredItem)
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedItems))
      } catch (error) {
        console.error("[v0] Failed to save cart:", error)
        // If quota exceeded, try to clear and notify user
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
          console.error("[v0] Storage quota exceeded")
        }
      }
    }
  }, [cart, isLoading])

  useEffect(() => {
    if (pendingOpenRef.current) {
      pendingOpenRef.current = false
      setIsOpen(true)
    }
  })

  const addItem = useCallback((product: Product, variant?: ProductVariant | null, quantity = 1): AddItemResult => {
    console.log("[v0] Adding item to cart:", {
      productName: product.name,
      requestedQuantity: quantity,
      productInventory: product.inventory_quantity,
      variantInventory: variant?.inventory_quantity,
    })

    let result: AddItemResult = { added: quantity, available: quantity, wasLimited: false }

    setCart((prev) => {
      const itemId = variant ? `${product.id}-${variant.id}` : product.id
      const existingIndex = prev.items.findIndex((item) =>
        variant ? item.id === itemId : item.product.id === product.id && !item.variant,
      )

      const maxAvailable = variant ? variant.inventory_quantity : product.inventory_quantity
      const currentQuantity = existingIndex >= 0 ? prev.items[existingIndex].quantity : 0
      const requestedTotal = currentQuantity + quantity
      const actualQuantity = Math.min(requestedTotal, maxAvailable) - currentQuantity

      console.log("[v0] Availability check:", {
        maxAvailable,
        currentQuantity,
        requestedTotal,
        actualQuantity,
        willLimit: actualQuantity < quantity,
      })

      if (actualQuantity < quantity) {
        result = {
          added: actualQuantity,
          available: maxAvailable,
          wasLimited: true,
        }
        console.log("[v0] Limited availability detected:", result)
      }

      if (actualQuantity <= 0) {
        result = {
          added: 0,
          available: maxAvailable,
          wasLimited: true,
        }
        console.log("[v0] No items added - at max capacity")
        return prev // Don't add anything
      }

      let newItems: CartItem[]
      if (existingIndex >= 0) {
        newItems = prev.items.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + actualQuantity } : item,
        )
      } else {
        newItems = [...prev.items, { id: itemId, product, variant, quantity: actualQuantity }]
      }

      return { items: newItems, ...calculateTotals(newItems) }
    })

    if (result.wasLimited) {
      const message =
        result.added > 0
          ? `Only ${result.added} item${result.added !== 1 ? "s" : ""} were added to your cart due to availability.`
          : `Cannot add more items. Only ${result.available} available in stock.`

      setAvailabilityWarning({
        message,
        available: result.available,
      })

      console.log("[v0] Availability warning set:", message)

      // Auto-clear warning after 5 seconds
      setTimeout(() => {
        setAvailabilityWarning(null)
        console.log("[v0] Availability warning cleared")
      }, 5000)
    }

    pendingOpenRef.current = true
    return result
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

  const clearAvailabilityWarning = useCallback(() => {
    setAvailabilityWarning(null)
    console.log("[v0] Availability warning manually cleared")
  }, [])

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
        availabilityWarning,
        clearAvailabilityWarning,
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
