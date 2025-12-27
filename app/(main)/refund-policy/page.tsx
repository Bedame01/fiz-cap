import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle, CheckCircle, RefreshCw, XCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Learn about Fiz Cap's refund and return policy for hassle-free shopping experience.",
}

export default function RefundPolicyPage() {
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
                <RefreshCw className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Returns</p>
            </div>
            <h1 className="font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">
              Refund & Return Policy
            </h1>
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
            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl">Our Commitment</h2>
            <p>
              At Fiz Cap, we stand behind the quality of our products. If you're not completely satisfied with your
              purchase, we're here to help. Please read our refund and return policy carefully to understand your rights
              and our procedures.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Return Eligibility</h2>
            <p>
              You have 7 calendar days from the date of delivery to return an item. To be eligible for a return, your
              item must meet the following conditions:
            </p>

            <div className="grid gap-4 mt-6 not-prose">
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm">Unworn, unwashed, and in original condition with all tags attached</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm">In the original packaging with all accessories included</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm">Proof of purchase (order number or receipt)</p>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Non-Returnable Items</h2>
            <p>Certain items cannot be returned for hygiene and safety reasons:</p>

            <div className="grid gap-4 mt-6 not-prose">
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">
                <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm">Items marked as final sale or clearance</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">
                <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm">Personalized or custom-made items</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900">
                <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm">Items damaged due to misuse or normal wear and tear</p>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">How to Return an Item</h2>
            <p>To initiate a return, please follow these steps:</p>
            <ol>
              <li>
                Contact our customer support team via email or through the contact form on our website with your order
                number and reason for return
              </li>
              <li>
                Wait for a return authorization (RA) number and return instructions from our team (usually within 24-48
                hours)
              </li>
              <li>Pack the item securely in its original packaging</li>
              <li>Include the RA number on the outside of the package</li>
              <li>Ship the item to the address provided by our customer support team</li>
            </ol>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Return Shipping Costs</h2>
            <p>
              Return shipping costs are the responsibility of the customer unless the return is due to our error
              (defective or incorrect item received). We recommend using a trackable shipping service and purchasing
              shipping insurance for valuable items, as we cannot guarantee that we will receive your returned item.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Refund Processing</h2>
            <p>
              Once we receive and inspect your return, we will send you an email notification confirming receipt. We
              will also notify you of the approval or rejection of your refund. If approved, your refund will be
              processed within 5-7 business days, and a credit will automatically be applied to your original method of
              payment.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Exchanges</h2>
            <p>
              We only replace items if they are defective or damaged. If you need to exchange an item for the same
              product, contact our customer support team first. For size exchanges or different products, you will need
              to return the original item and place a new order.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">Late or Missing Refunds</h2>
            <p>If you haven't received a refund after 7 business days, please:</p>
            <ul>
              <li>Check your bank account again</li>
              <li>Contact your credit card company (it may take time before your refund is officially posted)</li>
              <li>Contact your bank (there is often processing time before a refund is posted)</li>
              <li>
                If you've done all of this and still have not received your refund, please contact us with your order
                details
              </li>
            </ul>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">
              Damaged or Defective Items
            </h2>
            <p>
              If you receive a damaged or defective item, please contact us immediately with photos of the damage. We
              will arrange for a replacement or full refund, including return shipping costs. Quality is our priority,
              and we apologize for any inconvenience.
            </p>

            <div className="mt-16 p-6 bg-secondary/30 rounded-2xl border">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-medium mb-2">Need to return an item?</h3>
                  <p className="text-muted-foreground mb-4">
                    Our customer support team is ready to help you with your return or exchange.
                  </p>
                  <Button asChild>
                    <Link href="/contact">Start Return Process</Link>
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
