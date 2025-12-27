import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Scale } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read our Terms of Service to understand your rights and responsibilities when using Fiz Cap services.",
}

export default function TermsPage() {
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
                <Scale className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Legal</p>
            </div>
            <h1 className="font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">Terms of Service</h1>
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
            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl">1. Agreement to Terms</h2>
            <p>
              By accessing and using Fiz Cap's website and services, you agree to be bound by these Terms of Service and
              all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
              using or accessing this site.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Fiz
              Cap's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a
              transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on Fiz Cap's website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">3. Product Information</h2>
            <p>
              We strive to provide accurate product descriptions, pricing, and availability information. However, we do
              not warrant that product descriptions, pricing, or other content on this site is accurate, complete,
              reliable, current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions
              and to change or update information at any time without prior notice.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">4. Pricing and Payment</h2>
            <p>
              All prices are listed in Nigerian Naira (₦) and are subject to change without notice. We accept payment
              through our secure payment processor, Paystack. By providing payment information, you represent and
              warrant that you are authorized to use the payment method you provide and that you authorize us to charge
              your payment method for the total amount of your purchase.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">5. Order Acceptance</h2>
            <p>
              Your receipt of an electronic or other form of order confirmation does not signify our acceptance of your
              order, nor does it constitute confirmation of our offer to sell. We reserve the right to accept or decline
              your order for any reason at any time after receipt. We also reserve the right to limit order quantities
              and to refuse service to anyone.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">6. User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current
              at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
              termination of your account. You are responsible for safeguarding the password you use to access the
              service and for any activities or actions under your password.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">
              7. Intellectual Property
            </h2>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive
              property of Fiz Cap. The service is protected by copyright, trademark, and other laws of Nigeria and
              foreign countries. Our trademarks and trade dress may not be used in connection with any product or
              service without prior written consent.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">
              8. Limitation of Liability
            </h2>
            <p>
              In no event shall Fiz Cap or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on Fiz Cap's website, even if Fiz Cap or an authorized representative has been
              notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">9. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you
              irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>

            <h2 className="font-serif text-2xl font-light tracking-tight md:text-3xl mt-12">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify users of any material
              changes by posting the new Terms of Service on this page. Your continued use of the service after such
              modifications constitutes your acknowledgment and acceptance of the modified terms.
            </p>

            <div className="mt-16 p-6 bg-secondary/30 rounded-2xl border">
              <div className="flex items-start gap-4">
                <FileText className="h-6 w-6 text-muted-foreground shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-medium mb-2">Questions about our Terms?</h3>
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about these Terms of Service, please don't hesitate to contact us.
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
