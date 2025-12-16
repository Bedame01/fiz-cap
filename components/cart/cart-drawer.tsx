"use client"

import { useCart } from "./cart-context"
import { CartItem } from "./cart-item"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { formatPrice } from "@/lib/types/product"
import { ShoppingBag, ArrowRight, Loader2, AlertCircle, X } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CartDrawer() {
  const { cart, isOpen, setIsOpen, cartCount, isLoading, availabilityWarning, clearAvailabilityWarning } = useCart()
  const isEmpty = cart.items.length === 0

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Cart {cartCount > 0 && `(${cartCount})`}
          </SheetTitle>
        </SheetHeader>

        {availabilityWarning && (
          <Alert variant="destructive" className="mb-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <AlertDescription className="text-xs flex-1">{availabilityWarning.message}</AlertDescription>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={clearAvailabilityWarning}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </Alert>
        )}

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-4xl font-medium textDisplay">Your cart is empty</p>
            <p className="text-muted-foreground text-sm mt-1 mb-6">Add some items to get started</p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href="/shop">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto divide-y px-3">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Footer */}
            <div className="border-t pt-4 space-y-4 px-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>

              {/* <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</span>
              </div> */}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VAT (2.0%)</span>
                <span>{formatPrice(cart.tax)}</span>
              </div>

              <div className="flex justify-between text-lg font-medium pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(cart.total)}</span>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Shipping calculated at checkout based on your location
              </p>

              <div className="grid gap-2 pb-2">
                <Button asChild size="lg" onClick={() => setIsOpen(false)}>
                  <Link href="/checkout">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
