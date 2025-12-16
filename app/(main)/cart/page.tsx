"use client"

import Link from "next/link"
import { useCart } from "@/components/cart/cart-context"
import { CartItem } from "@/components/cart/cart-item"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatPrice } from "@/lib/types/product"
import { ShoppingBag, ArrowLeft, ArrowRight, Loader2, AlertCircle } from "lucide-react"

export default function CartPage() {
  const { cart, cartCount, isLoading, availabilityWarning, clearAvailabilityWarning } = useCart()
  const isEmpty = cart.items.length === 0

  if (isEmpty) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="text-3xl font-bold tracking-tight mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you have not added anything to your cart yet. Start exploring our collection.
          </p>
          <Button asChild size="lg">
            <Link href="/shop">
              Start Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart ({cartCount})</h1>
        <Button variant="ghost" asChild>
          <Link href="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      {availabilityWarning && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{availabilityWarning.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border divide-y">
            {cart.items.map((item) => (
              <div key={item.id} className="px-4">
                <CartItem item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground text-xs">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT (2.0%)</span>
                <span>{formatPrice(cart.tax)}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-lg font-medium">
                <span>Estimated Total</span>
                <span>{formatPrice(cart.subtotal + cart.tax)}</span>
              </div>
            </div>

            <Button className="w-full mt-6" size="lg" asChild>
              <Link href="/checkout">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Proceed to Checkout
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Free shipping on orders over ₦50,000
              <br />
              Shipping cost based on your state
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
