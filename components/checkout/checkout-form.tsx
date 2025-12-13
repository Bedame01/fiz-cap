"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart/cart-context"
import { formatPrice } from "@/lib/types/product"
import { generateReference } from "@/lib/paystack"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CreditCard, Building2, Smartphone } from "lucide-react"
import { toast } from "sonner"
import Script from "next/script"

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  notes: string
}

interface PaystackResponse {
  reference: string
  status: string
  trans: string
  transaction: string
  message: string
}

export function CheckoutForm() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paystackLoaded, setPaystackLoaded] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state"]
    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        toast.error(`Please fill in your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`)
        return false
      }
    }
    if (!shippingInfo.email.includes("@")) {
      toast.error("Please enter a valid email address")
      return false
    }
    return true
  }

  const handlePaystackSuccess = useCallback(
    (response: PaystackResponse) => {
      // Verify transaction
      fetch(`/api/paystack/verify?reference=${response.reference}`)
        .then((res) => res.json())
        .then((verifyData) => {
          if (verifyData.status && verifyData.data?.status === "success") {
            clearCart()
            toast.success("Payment successful!")
            router.push(`/checkout/success?reference=${response.reference}`)
          } else {
            toast.error("Payment verification failed. Please contact support.")
          }
        })
        .catch(() => {
          toast.error("Failed to verify payment. Please contact support.")
        })
        .finally(() => {
          setIsProcessing(false)
        })
    },
    [clearCart, router],
  )

  const handlePaystackClose = useCallback(() => {
    toast.info("Payment cancelled")
    setIsProcessing(false)
  }, [])

  const handlePayment = async () => {
    if (!validateForm()) return
    if (cart.items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsProcessing(true)
    const reference = generateReference()

    try {
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          total_amount: Math.round(cart.total * 100),
          shipping_info: shippingInfo,
          items: cart.items.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            variant_id: item.variant?.id || null,
            variant_name: item.variant ? `${item.variant.size || ""} ${item.variant.color || ""}`.trim() : null,
            quantity: item.quantity,
            unit_price: Math.round((item.product.price + (item.variant?.price_adjustment || 0)) * 100),
          })),
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      // Initialize Paystack payment
      const PaystackPop = (
        window as unknown as { PaystackPop?: { setup: (config: unknown) => { openIframe: () => void } } }
      ).PaystackPop
      if (!PaystackPop) {
        throw new Error("Payment system not loaded")
      }

      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: shippingInfo.email,
        amount: Math.round(cart.total * 100),
        currency: "NGN",
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: shippingInfo.phone,
            },
          ],
          cart_items: cart.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
          })),
        },
        callback: handlePaystackSuccess,
        onClose: handlePaystackClose,
      })

      handler.openIframe()
    } catch (error) {
      console.error("Payment error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to process payment. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" onLoad={() => setPaystackLoaded(true)} />

      <div className="space-y-8">
        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-medium mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={shippingInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                placeholder="+234"
                required
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" value={shippingInfo.city} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input id="state" name="state" value={shippingInfo.state} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" name="postalCode" value={shippingInfo.postalCode} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={shippingInfo.country} onChange={handleInputChange} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={shippingInfo.notes}
                onChange={handleInputChange}
                placeholder="Any special instructions for delivery..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Payment Methods Info */}
        <div>
          <h2 className="text-lg font-medium mb-4">Payment Method</h2>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">Secure payment powered by Paystack. You can pay with:</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4" />
                <span>Bank Transfer</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4" />
                <span>USSD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>VAT (7.5%)</span>
            <span>{formatPrice(cart.tax)}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
        </div>

        {/* Pay Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handlePayment}
          disabled={isProcessing || !paystackLoaded || cart.items.length === 0}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Pay ${formatPrice(cart.total)}`
          )}
        </Button>
      </div>
    </>
  )
}