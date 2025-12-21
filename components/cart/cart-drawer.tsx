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
            {/* <ShoppingBag className="w-5 h-5" /> */}
            <svg className="icon icon-cart size-5 fill-foreground" role="img" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="cart-icon">
              <title id="cart-icon">Cart</title>
              <g clip-path="url(#clip0_738:3282)">
              <path d="M22.4717 23.9989H0.524841C0.455894 23.9998 0.387406 23.9876 0.323371 23.963C0.259337 23.9384 0.200993 23.9018 0.151663 23.8555C0.102333 23.8091 0.0629937 23.7538 0.0359119 23.6928C0.00883007 23.6318 -0.00547204 23.5663 -0.00616455 23.4999V8.2669C-0.00547204 8.20056 0.00883007 8.135 0.0359119 8.07399C0.0629937 8.01297 0.102333 7.95768 0.151663 7.91132C0.200993 7.86496 0.259337 7.82845 0.323371 7.80384C0.387406 7.77923 0.455894 7.76698 0.524841 7.76788H22.4717C22.5407 7.76687 22.6092 7.77896 22.6733 7.80353C22.7374 7.8281 22.7958 7.86463 22.8451 7.91101C22.8945 7.95739 22.9338 8.01271 22.9609 8.07378C22.9879 8.13485 23.0021 8.20053 23.0027 8.2669V23.4999C23.002 23.5663 22.9877 23.6318 22.9606 23.6928C22.9335 23.7538 22.8942 23.8091 22.8449 23.8555C22.7956 23.9018 22.7372 23.9384 22.6731 23.963C22.6091 23.9876 22.5407 23.9998 22.4717 23.9989ZM1.05579 23.0002H21.9408V8.76582H1.05579V23.0002Z" fill="inherit"></path>
              <path d="M16.3355 8.63991C16.19 8.63991 16.0504 8.58425 15.9475 8.48525C15.8446 8.38624 15.7868 8.25201 15.7868 8.11199C15.7868 3.62807 14.224 1.05574 11.4992 1.05574C8.7744 1.05574 7.21159 3.62807 7.21159 8.11199C7.21159 8.25201 7.15375 8.38624 7.05085 8.48525C6.94795 8.58425 6.80844 8.63991 6.66293 8.63991C6.51741 8.63991 6.37784 8.58425 6.27495 8.48525C6.17205 8.38624 6.11426 8.25201 6.11426 8.11199C6.11426 3.03288 8.1275 0.000732422 11.4992 0.000732422C14.8709 0.000732422 16.8842 3.03288 16.8842 8.11199C16.8842 8.25201 16.8264 8.38624 16.7235 8.48525C16.6206 8.58425 16.481 8.63991 16.3355 8.63991Z" fill="inherit"></path>
              <path d="M18.978 16.8235C18.8325 16.8235 18.6929 16.7679 18.59 16.6689C18.4871 16.5699 18.4293 16.4356 18.4293 16.2956V11.655H12.8045C12.659 11.655 12.5194 11.5994 12.4165 11.5004C12.3137 11.4014 12.2559 11.2671 12.2559 11.127C12.2559 10.987 12.3137 10.8528 12.4165 10.7538C12.5194 10.6548 12.659 10.5991 12.8045 10.5991H18.978C19.1235 10.5991 19.2631 10.6548 19.366 10.7538C19.4689 10.8528 19.5267 10.987 19.5267 11.127V16.2956C19.5267 16.3649 19.5125 16.4335 19.4849 16.4976C19.4573 16.5616 19.4169 16.6199 19.366 16.6689C19.315 16.7179 19.2545 16.7568 19.1879 16.7833C19.1214 16.8098 19.05 16.8235 18.978 16.8235Z" fill="inherit"></path>
              </g>
              <defs>
              <clipPath id="clip0_738:3282">
              <rect width="23" height="24" fill="white"></rect>
              </clipPath>
              </defs>
            </svg>
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
            {/* <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" /> */}
            <svg className="icon icon-cart size-16 fill-muted-foreground/30 mb-4" role="img" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="cart-icon">
              <title id="cart-icon">Cart</title>
              <g clip-path="url(#clip0_738:3282)">
              <path d="M22.4717 23.9989H0.524841C0.455894 23.9998 0.387406 23.9876 0.323371 23.963C0.259337 23.9384 0.200993 23.9018 0.151663 23.8555C0.102333 23.8091 0.0629937 23.7538 0.0359119 23.6928C0.00883007 23.6318 -0.00547204 23.5663 -0.00616455 23.4999V8.2669C-0.00547204 8.20056 0.00883007 8.135 0.0359119 8.07399C0.0629937 8.01297 0.102333 7.95768 0.151663 7.91132C0.200993 7.86496 0.259337 7.82845 0.323371 7.80384C0.387406 7.77923 0.455894 7.76698 0.524841 7.76788H22.4717C22.5407 7.76687 22.6092 7.77896 22.6733 7.80353C22.7374 7.8281 22.7958 7.86463 22.8451 7.91101C22.8945 7.95739 22.9338 8.01271 22.9609 8.07378C22.9879 8.13485 23.0021 8.20053 23.0027 8.2669V23.4999C23.002 23.5663 22.9877 23.6318 22.9606 23.6928C22.9335 23.7538 22.8942 23.8091 22.8449 23.8555C22.7956 23.9018 22.7372 23.9384 22.6731 23.963C22.6091 23.9876 22.5407 23.9998 22.4717 23.9989ZM1.05579 23.0002H21.9408V8.76582H1.05579V23.0002Z" fill="inherit"></path>
              <path d="M16.3355 8.63991C16.19 8.63991 16.0504 8.58425 15.9475 8.48525C15.8446 8.38624 15.7868 8.25201 15.7868 8.11199C15.7868 3.62807 14.224 1.05574 11.4992 1.05574C8.7744 1.05574 7.21159 3.62807 7.21159 8.11199C7.21159 8.25201 7.15375 8.38624 7.05085 8.48525C6.94795 8.58425 6.80844 8.63991 6.66293 8.63991C6.51741 8.63991 6.37784 8.58425 6.27495 8.48525C6.17205 8.38624 6.11426 8.25201 6.11426 8.11199C6.11426 3.03288 8.1275 0.000732422 11.4992 0.000732422C14.8709 0.000732422 16.8842 3.03288 16.8842 8.11199C16.8842 8.25201 16.8264 8.38624 16.7235 8.48525C16.6206 8.58425 16.481 8.63991 16.3355 8.63991Z" fill="inherit"></path>
              <path d="M18.978 16.8235C18.8325 16.8235 18.6929 16.7679 18.59 16.6689C18.4871 16.5699 18.4293 16.4356 18.4293 16.2956V11.655H12.8045C12.659 11.655 12.5194 11.5994 12.4165 11.5004C12.3137 11.4014 12.2559 11.2671 12.2559 11.127C12.2559 10.987 12.3137 10.8528 12.4165 10.7538C12.5194 10.6548 12.659 10.5991 12.8045 10.5991H18.978C19.1235 10.5991 19.2631 10.6548 19.366 10.7538C19.4689 10.8528 19.5267 10.987 19.5267 11.127V16.2956C19.5267 16.3649 19.5125 16.4335 19.4849 16.4976C19.4573 16.5616 19.4169 16.6199 19.366 16.6689C19.315 16.7179 19.2545 16.7568 19.1879 16.7833C19.1214 16.8098 19.05 16.8235 18.978 16.8235Z" fill="inherit"></path>
              </g>
              <defs>
              <clipPath id="clip0_738:3282">
              <rect width="23" height="24" fill="white"></rect>
              </clipPath>
              </defs>
            </svg>
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
