import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Ruler, HelpCircle, Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Size Guide",
  description:
    "Find your perfect fit with our comprehensive cap sizing guide. Learn how to measure your head and choose the right size.",
}

export default function SizeGuidePage() {
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
                <Ruler className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Help</p>
            </div>
            <h1 className="font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">Size Guide</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Find your perfect fit with our comprehensive sizing guide
            </p>
          </div>
        </div>
      </section>

      {/* How to Measure Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Ruler className="h-6 w-6 text-primary" />
              <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl">How to Measure Your Head</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Get a Measuring Tape</h3>
                    <p className="text-muted-foreground">
                      Use a soft, flexible measuring tape. If you don't have one, use a piece of string and measure it
                      against a ruler.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Position the Tape</h3>
                    <p className="text-muted-foreground">
                      Place the tape about 1 inch above your eyebrows and ears, wrapping it around the widest part of
                      your head.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Take the Measurement</h3>
                    <p className="text-muted-foreground">
                      Keep the tape snug but not tight. Note the measurement in inches or centimeters and refer to our
                      size chart below.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-secondary/30 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Ruler className="h-16 w-16 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Measure around the widest part of your head</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Size Chart Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl mb-8 text-center">
              Cap Size Chart
            </h2>
            <div className="bg-background rounded-2xl overflow-hidden shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/30">
                      <th className="px-6 py-4 text-left font-medium">Size</th>
                      <th className="px-6 py-4 text-left font-medium">Inches</th>
                      <th className="px-6 py-4 text-left font-medium">Centimeters</th>
                      <th className="px-6 py-4 text-left font-medium">Fit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 font-medium">7</td>
                      <td className="px-6 py-4">22"</td>
                      <td className="px-6 py-4">55.9 cm</td>
                      <td className="px-6 py-4 text-muted-foreground">Extra Small</td>
                    </tr>
                    <tr className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 font-medium">7⅛</td>
                      <td className="px-6 py-4">22.4"</td>
                      <td className="px-6 py-4">57 cm</td>
                      <td className="px-6 py-4 text-muted-foreground">Small</td>
                    </tr>
                    <tr className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 font-medium">7¼</td>
                      <td className="px-6 py-4">22.8"</td>
                      <td className="px-6 py-4">58 cm</td>
                      <td className="px-6 py-4 text-muted-foreground">Small-Medium</td>
                    </tr>
                    <tr className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 font-medium">7⅜</td>
                      <td className="px-6 py-4">23.2"</td>
                      <td className="px-6 py-4">58.7 cm</td>
                      <td className="px-6 py-4 text-muted-foreground">Medium</td>
                    </tr>
                    <tr className="hover:bg-secondary/10 transition-colors bg-primary/5">
                      <td className="px-6 py-4 font-medium">7½</td>
                      <td className="px-6 py-4">23.6"</td>
                      <td className="px-6 py-4">59.6 cm</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          Medium-Large
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            Most Popular
                          </span>
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 font-medium">7⅝</td>
                      <td className="px-6 py-4">24"</td>
                      <td className="px-6 py-4">60.6 cm</td>
                      <td className="px-6 py-4 text-muted-foreground">Large</td>
                    </tr>
                    <tr className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 font-medium">7¾</td>
                      <td className="px-6 py-4">24.4"</td>
                      <td className="px-6 py-4">61.5 cm</td>
                      <td className="px-6 py-4 text-muted-foreground">Extra Large</td>
                    </tr>
                    <tr className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 font-medium">8</td>
                      <td className="px-6 py-4">25.2"</td>
                      <td className="px-6 py-4">63.5 cm</td>
                      <td className="px-6 py-4 text-muted-foreground">XXL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Pro Tip:</strong> If you're between sizes, we recommend sizing up
                for a more comfortable fit. Most of our caps also feature adjustable straps for a customized fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitting Tips Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl mb-8">Fitting Tips</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-secondary/30 rounded-2xl border">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    ✓
                  </span>
                  Perfect Fit
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sits comfortably without pressure points</li>
                  <li>• Doesn't leave marks on your forehead</li>
                  <li>• Stays in place during normal activities</li>
                  <li>• Feels secure but not tight</li>
                </ul>
              </div>
              <div className="p-6 bg-secondary/30 rounded-2xl border">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-[#fff] text-sm">
                    ✗
                  </span>
                  Too Tight/Loose
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Causes headaches or discomfort</li>
                  <li>• Slides around or falls off easily</li>
                  <li>• Leaves red marks on your forehead</li>
                  <li>• Gaps between cap and head visible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl">Common Questions</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-background p-6 rounded-2xl border">
                <h3 className="font-medium mb-2">What if I'm between sizes?</h3>
                <p className="text-muted-foreground">
                  We recommend sizing up for a more comfortable fit. Most of our caps have adjustable closures that
                  allow you to fine-tune the fit.
                </p>
              </div>
              <div className="bg-background p-6 rounded-2xl border">
                <h3 className="font-medium mb-2">Do your caps stretch over time?</h3>
                <p className="text-muted-foreground">
                  Our caps are made with high-quality materials that maintain their shape. However, slight stretching
                  may occur with regular wear. Starting with a proper fit ensures long-term comfort.
                </p>
              </div>
              <div className="bg-background p-6 rounded-2xl border">
                <h3 className="font-medium mb-2">Can I exchange if the size doesn't fit?</h3>
                <p className="text-muted-foreground">
                  Yes! We offer hassle-free exchanges within 30 days of purchase. Please refer to our{" "}
                  <Link href="/refund-policy" className="text-primary hover:underline">
                    Refund Policy
                  </Link>{" "}
                  for complete details.
                </p>
              </div>
              <div className="bg-background p-6 rounded-2xl border">
                <h3 className="font-medium mb-2">Are adjustable caps one-size-fits-all?</h3>
                <p className="text-muted-foreground">
                  While adjustable caps offer flexibility, we recommend measuring your head to ensure the adjustment
                  range will accommodate your size comfortably.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 text-center">
              <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl mb-4">Still Need Help?</h2>
              <p className="text-lg mb-8 opacity-90">
                Our customer service team is here to help you find the perfect fit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/shop">Shop Caps</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
