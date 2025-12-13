import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Mail, Instagram, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Fiz Cap products, shipping, returns, and more.",
}

const faqCategories = [
  {
    name: "Orders & Shipping",
    faqs: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping within Nigeria typically takes 3-5 business days. Express shipping is available for 1-2 business day delivery in major cities like Lagos, Abuja, and Port Harcourt. You'll receive a tracking number once your order ships.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Yes! We offer free standard shipping on all orders over ₦50,000. Orders below this amount have a flat shipping fee of ₦2,500 for standard delivery.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Once your order ships, you'll receive an email with your tracking number and a link to track your package in real-time. You can also check your order status in your account dashboard.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we only ship within Nigeria. We're working on expanding our delivery network to other African countries. Sign up for our newsletter to be notified when we launch international shipping.",
      },
    ],
  },
  {
    name: "Returns & Exchanges",
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 14-day return policy for unworn items in their original packaging with tags attached. Items must be in the same condition as received. Sale items and customized products are final sale.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "To start a return, log into your account, go to your order history, and select 'Request Return' for the item you wish to return. You'll receive a prepaid return label via email. Once we receive and inspect the item, your refund will be processed within 5-7 business days.",
      },
      {
        question: "Can I exchange an item for a different size?",
        answer:
          "Yes! If you need a different size, you can request an exchange through your account. We'll send you the new size once we receive your return. If the desired size is out of stock, we'll issue a full refund.",
      },
      {
        question: "What if I receive a damaged item?",
        answer:
          "We're sorry if your item arrived damaged! Please contact us within 48 hours of delivery with photos of the damage. We'll send a replacement immediately at no additional cost.",
      },
    ],
  },
  {
    name: "Products & Sizing",
    faqs: [
      {
        question: "How do I find my cap size?",
        answer:
          "To find your size, measure around your head about 1 inch above your eyebrows where your cap will sit. Use a flexible measuring tape and check our size guide: S (54-55cm), M (56-57cm), L (58-59cm), XL (60-61cm). Snapbacks and dad hats are adjustable and fit most head sizes.",
      },
      {
        question: "What materials are your caps made from?",
        answer:
          "Our caps are crafted from premium materials including 100% cotton, cotton-polyester blends, wool, and performance fabrics. Each product page lists the specific materials used. All our materials are selected for durability, comfort, and style.",
      },
      {
        question: "How should I care for my cap?",
        answer:
          "For best results, spot clean your cap with a damp cloth and mild soap. For deeper cleaning, hand wash in cold water and air dry. Never put your cap in the washing machine or dryer as this can damage the shape and materials. Store your caps on a flat surface or cap rack to maintain their shape.",
      },
      {
        question: "Are your caps unisex?",
        answer:
          "Yes! Most of our caps are designed to be unisex and suitable for everyone. We offer a wide range of sizes and adjustable options to ensure a comfortable fit for all head sizes and shapes.",
      },
    ],
  },
  {
    name: "Payment & Security",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major payment methods through Paystack including debit/credit cards (Visa, Mastercard, Verve), bank transfers, and USSD. All transactions are secured with bank-level encryption.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "We use Paystack, Nigeria's leading payment processor, which is PCI DSS compliant. Your card details are encrypted and never stored on our servers. We also use SSL encryption across our entire website.",
      },
      {
        question: "Can I pay on delivery?",
        answer:
          "Currently, we only accept prepaid orders through our secure checkout. This helps us maintain competitive pricing and fast shipping times. We're exploring pay-on-delivery options for the future.",
      },
      {
        question: "Do you offer installment payments?",
        answer:
          "We're working on partnering with buy-now-pay-later services to offer installment payment options. Sign up for our newsletter to be notified when this feature launches.",
      },
    ],
  },
  {
    name: "Account & Orders",
    faqs: [
      {
        question: "Do I need an account to place an order?",
        answer:
          "No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, view order history, and get faster checkout on future purchases. Plus, account holders get early access to new releases and exclusive offers.",
      },
      {
        question: "How do I check my order status?",
        answer:
          "If you have an account, log in and visit the 'My Orders' section to see all your orders and their current status. If you checked out as a guest, use the tracking link sent to your email to monitor your delivery.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "You can modify or cancel your order within 1 hour of placing it. After that, orders enter processing and cannot be changed. Contact our support team immediately if you need to make changes.",
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer:
          "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link within a few minutes. If you don't see the email, check your spam folder or contact support.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-secondary/30 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">Support</p>
            <h1 className="font-serif text-4xl font-light tracking-tight md:text-5xl lg:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Find answers to common questions about our products, shipping, returns, and more. Can't find what you're
              looking for? Contact us.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {faqCategories.map((category, categoryIndex) => (
              <div key={category.name} className="mb-12 last:mb-0">
                <h2 className="mb-6 text-2xl font-medium textDisplay">{category.name}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="rounded-xl border bg-background px-6 data-[state=open]:shadow-sm"
                    >
                      <AccordionTrigger className="py-5 text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="border-t bg-secondary/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl">Still have questions?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our support team is here to help you with anything you need.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border bg-background p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Instagram className="h-6 w-6" />
                </div>
                <h3 className="font-medium">Instagram Page</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Chat with us on Instagram, we'll get back to you ASAP.
                </p>
                <Button variant="link" asChild className="mt-4 p-0">
                  <Link href="https://instagram.com/Fiz_caps" >
                    Start Chat
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="rounded-2xl border bg-background p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-medium">Email Us</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <Button variant="link" asChild className="mt-4 p-0">
                  <Link href="mailto:Fizayomi21@gmail.com">
                    Fizayomi21@gmail.com
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="rounded-2xl border bg-background p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-medium">Call Us</h3>
                <p className="mt-2 text-sm text-muted-foreground">Mon-Fri from 9am to 6pm WAT</p>
                <Button variant="link" asChild className="mt-4 p-0">
                  <Link href="tel:+2341234567890">
                    +234 123 456 7890
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
