import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Package, Truck } from "lucide-react"

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Learn about Fiz Cap's shipping policy, delivery times, and shipping costs across Nigeria.",
}

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Button asChild variant="ghost" size="sm" className="mb-6">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Truck className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Delivery</p>
            </div>
            <h1 className="font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">Shipping Policy</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl prose prose-slate dark:prose-invert">
            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl">Shipping Coverage</h2>
            <p>
              Fiz Cap delivers to all states across Nigeria. We partner with reliable courier services to ensure your
              orders reach you safely and promptly. Our shipping zones are designed to provide fair and transparent
              pricing based on your location.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Processing Time</h2>
            <p>
              All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your
              order confirmation email. You can track orders in account/order page when your order has shipped, along with
              tracking information to monitor your delivery.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">
              Shipping Rates and Delivery Times
            </h2>
            <p>
              Shipping costs are calculated dynamically at checkout based on your delivery address and the weight of
              your order. We have divided Nigeria into shipping zones to ensure fair and accurate pricing:
            </p>

            <div className="grid gap-6 mt-8 not-prose">
              <div className="p-6 bg-secondary/30 rounded-2xl border">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Zone 1 - Lagos Metro</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Delivery: 1-2 business days | Starting from ₦2,000
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-secondary/30 rounded-2xl border">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Zone 2 - South West</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Delivery: 2-3 business days | Starting from ₦2,500
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-secondary/30 rounded-2xl border">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Zone 3-7 - Other Regions</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Delivery: 3-6 business days | Starting from ₦3,000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Free Shipping</h2>
            <p>
              We offer free standard shipping on all orders over ₦100,000 to any location in Nigeria. This is our way of
              saying thank you for choosing Fiz Cap for your premium headwear needs.
            </p>

            {/* <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Order Tracking</h2>
            <p>
              Once your order has been shipped, you will receive a tracking number via email. You can use this number to
              track your package's journey to your doorstep. If you experience any delays or issues with tracking,
              please contact our customer support team.
            </p> */}

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Delivery Issues</h2>
            <p>
              Fiz Cap is not responsible for delays caused by courier services, natural disasters, or other
              circumstances beyond our control. If your order is lost or damaged during shipping, please contact us
              within 48 hours of the expected delivery date, and we will work with you to resolve the issue.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">International Shipping</h2>
            <p>
              Currently, Fiz Cap only ships within Nigeria. We are working on expanding our shipping capabilities to
              serve customers internationally. Please check back for updates or contact us to express your interest in
              international delivery.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Address Changes</h2>
            <p>
              If you need to change your shipping address after placing an order, please contact us immediately. We will
              do our best to update your address if the order has not yet been shipped. Once an order is in transit, we
              cannot modify the delivery address.
            </p>

            <div className="mt-16 p-6 bg-secondary/30 rounded-2xl border">
              <div className="flex items-start gap-4">
                <Package className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-medium mb-2">Questions about shipping?</h3>
                  <p className="text-muted-foreground mb-4">
                    Our customer support team is here to help with any questions about your delivery.
                  </p>
                  <Button asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
