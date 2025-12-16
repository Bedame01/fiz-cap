"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart/cart-context"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { formatPrice } from "@/lib/types/product"
import { ArrowLeft, ShoppingBag, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function CheckoutPage() {
  const { cart, cartCount } = useCart()
  const [shippingCost, setShippingCost] = useState(0)
  const [taxAmount, setTaxAmount] = useState(cart.tax)

  useEffect(() => {
    const calculatedTax = cart.subtotal * 0.020 // 2.0% VAT
    setTaxAmount(calculatedTax)
  }, [cart.subtotal])

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
        <h1 className="text-3xl font-bold tracking-tight mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some items to your cart to checkout</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-secondary/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild>
            <Link href="/cart">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            Secure Checkout
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-card rounded-lg border p-6 max-sm:p-4">
              <h1 className="text-2xl font-bold tracking-tight mb-6">Checkout</h1>
              <CheckoutForm onShippingCalculated={setShippingCost} />
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-card rounded-lg border p-6 sticky top-8">
              <h2 className="text-lg font-medium mb-4">Order Summary ({cartCount} items)</h2>

              {/* Items */}
              <div className="divide-y max-h-80 overflow-y-auto">
                {cart.items.map((item) => {
                  const image = item.product.images?.[0]
                  const itemPrice = item.product.price + (item.variant?.price_adjustment || 0)
                  const lineTotal = itemPrice * item.quantity

                  return (
                    <div key={item.id} className="flex gap-3 py-3">
                      <div className="relative w-16 h-16 bg-secondary rounded-md flex-shrink-0 border-2 border-foreground">
                        {image ? (
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={image.alt_text || item.product.name}
                            fill
                            className="object-cover rounded-md"
                            sizes="64px"
                          />
                        ) : null}
                        <span className="absolute -top-2 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                        {item.variant && (item.variant.size || item.variant.color) && (
                          <p className="text-xs text-muted-foreground">
                            {[item.variant.size, item.variant.color].filter(Boolean).join(" / ")}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-medium">{formatPrice(lineTotal)}</span>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? ".." : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (2.0%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>{formatPrice(cart.subtotal + shippingCost + taxAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}