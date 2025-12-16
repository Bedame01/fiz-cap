"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart/cart-context"
import { formatPrice } from "@/lib/types/product"
import { generateReference } from "@/lib/paystack"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CreditCard, Building2, Smartphone, TruckIcon } from "lucide-react"
import { toast } from "sonner"
import Script from "next/script"
import { getAvailableStates } from "@/lib/shipping/calculator"
import Link from "next/link"

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

interface CheckoutFormProps {
  onShippingCalculated?: (cost: number) => void
}

export function CheckoutForm({ onShippingCalculated }: CheckoutFormProps) {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paystackLoaded, setPaystackLoaded] = useState(false)
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [shippingCost, setShippingCost] = useState<number>(0)
  const [shippingZone, setShippingZone] = useState<string>("")
  const [estimatedDays, setEstimatedDays] = useState<string>("")
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)
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

  useEffect(() => {
    console.log("[v0] Checkout button state:", {
      isProcessing,
      paystackLoaded,
      hasItems: cart.items.length > 0,
      hasState: !!shippingInfo.state,
      isCalculatingShipping,
      isDisabled:
        isProcessing || !paystackLoaded || cart.items.length === 0 || !shippingInfo.state || isCalculatingShipping,
    })
  }, [isProcessing, paystackLoaded, cart.items.length, shippingInfo.state, isCalculatingShipping])

  useEffect(() => {
    getAvailableStates().then(setAvailableStates)
  }, [])

  useEffect(() => {
    if (shippingInfo.state && cart.items.length > 0) {
      setIsCalculatingShipping(true)
      fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: shippingInfo.state,
          subtotal: cart.subtotal,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setShippingCost(data.shipping.cost)
            setShippingZone(data.shipping.zone_name)
            setEstimatedDays(data.shipping.estimated_days)
          }
        })
        .catch((error) => {
          console.error("[v0] Shipping calculation error:", error)
          setShippingCost(2500) // Fallback
        })
        .finally(() => {
          setIsCalculatingShipping(false)
        })
    }
  }, [shippingInfo.state, cart.subtotal, cart.items])

  useEffect(() => {
    if (onShippingCalculated) {
      onShippingCalculated(shippingCost)
    }
  }, [shippingCost, onShippingCalculated])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleStateChange = (value: string) => {
    setShippingInfo((prev) => ({ ...prev, state: value }))
  }

  const handlePaystackSuccess = useCallback(
    (response: PaystackResponse) => {
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

    const finalTotal = cart.subtotal + shippingCost + cart.tax

    try {
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          total_amount: Math.round(finalTotal * 100),
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

      const PaystackPop = (
        window as unknown as { PaystackPop?: { setup: (config: unknown) => { openIframe: () => void } } }
      ).PaystackPop
      if (!PaystackPop) {
        throw new Error("Payment system not loaded")
      }

      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: shippingInfo.email,
        amount: Math.round(finalTotal * 100),
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

  const isButtonDisabled =
    isProcessing || !paystackLoaded || cart.items.length === 0 || !shippingInfo.state || isCalculatingShipping

  const getButtonText = () => {
    if (isProcessing) return "Processing..."
    if (!paystackLoaded) return "Loading payment system..."
    if (cart.items.length === 0) return "Cart is empty"
    if (!shippingInfo.state) return "Select state to continue"
    if (isCalculatingShipping) return "Calculating shipping..."
    return `Pay ${formatPrice(cart.subtotal + shippingCost + cart.tax)}`
  }

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        onLoad={() => {
          console.log("[v0] Paystack script loaded successfully")
          setPaystackLoaded(true)
        }}
        onError={(e) => {
          console.error("[v0] Failed to load Paystack script:", e)
          toast.error("Payment system failed to load. Please refresh the page.")
        }}
        strategy="lazyOnload"
      />

      <div className="space-y-8">
        {/* Contact Information */}
        <div>
          <h2 className="text-lg font-medium mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              {/* <Label htmlFor="firstName">First Name *</Label> */}
              <Input
                id="firstName"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={handleInputChange}
                required
                placeholder="First Name"
                className="py-6 text-sm"
              />
            </div>
            <div className="space-y-2">
              {/* <Label htmlFor="lastName">Last Name *</Label> */}
              <Input
                id="lastName"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={handleInputChange}
                required
                placeholder="Last Name"
                className="py-6 text-sm"
              />
            </div>
            <div className="space-y-2">
              {/* <Label htmlFor="email">Email *</Label> */}
              <Input
                id="email"
                name="email"
                type="email"
                value={shippingInfo.email}
                onChange={handleInputChange}
                required
                placeholder="Email"
                className="py-6 text-sm"
              />
            </div>
            <div className="space-y-2">
              {/* <Label htmlFor="phone">Phone *</Label> */}
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                placeholder="+234"
                required
                className="py-6 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              {/* <Label htmlFor="address">Address *</Label> */}
              <Input id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} required placeholder="Address" className="py-6 text-sm"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                {/* <Label htmlFor="city">City *</Label> */}
                <Input id="city" name="city" value={shippingInfo.city} onChange={handleInputChange} required placeholder="City" className="py-6 text-sm"/>
              </div>
              <div className="space-y-2">
                {/* <Label htmlFor="state">State *</Label> */}
                <Select value={shippingInfo.state} onValueChange={handleStateChange}>
                  <SelectTrigger className="py-6 text-sm">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                {/* <Label htmlFor="postalCode">Postal Code</Label> */}
                <Input id="postalCode" name="postalCode" value={shippingInfo.postalCode} onChange={handleInputChange} placeholder="Postal code (optional)" className="py-6 text-sm"/>
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

        {shippingInfo.state && (
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <TruckIcon className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1">Shipping Details</h3>
                {isCalculatingShipping ? (
                  <p className="text-sm text-muted-foreground">Calculating shipping cost...</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {shippingZone} - {shippingCost === 0 ? "Free Shipping" : formatPrice(shippingCost)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Estimated delivery: {estimatedDays}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Info */}
        <div>
          <h2 className="text-lg font-medium mb-4">Payment</h2>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">All transactions are secure and encrypted.. You can pay with:</p>
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
            <span>
              {isCalculatingShipping ? (
                <Loader2 className="w-3 h-3 animate-spin inline" />
              ) : shippingCost === 0 ? (
                ".."
              ) : (
                formatPrice(shippingCost)
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>VAT (2.0%)</span>
            <span>{formatPrice(cart.tax)}</span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total</span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">NGN</span>
              <span className="text-lg">{formatPrice(cart.subtotal + shippingCost + cart.tax)}.00</span>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <Button className="w-full py-6 cursor-pointer" size="lg" onClick={handlePayment} disabled={isButtonDisabled}>
          {getButtonText()}
        </Button>

        {!shippingInfo.state && (
          <p className="text-sm text-muted-foreground text-center">
            Please select your state to calculate shipping and enable checkout
          </p>
        )}

        <div className="flex items-center gap-3 border-t pt-4 flex-wrap gap-y-2">
          <Link href="/refund" className="text-sm underline text-blue-500 hover:text-(--primary-color)">
            Refund policy
          </Link>
          <Link href="/refund" className="text-sm underline text-blue-500 hover:text-(--primary-color)">
            Shipping
          </Link>
          <Link href="/refund" className="text-sm underline text-blue-500 hover:text-(--primary-color)">
            Privacy policy
          </Link>
          <Link href="/refund" className="text-sm underline text-blue-500 hover:text-(--primary-color)">
            Terms of service
          </Link>
          <Link href="/refund" className="text-sm underline text-blue-500 hover:text-(--primary-color)">
            Contact
          </Link>
        </div>
      </div>
    </>
  )
}
