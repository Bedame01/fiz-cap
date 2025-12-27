import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Award, Heart, Shield, Sparkles, Truck, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import aboutBg from '@/public/images/heroFeatured.jpeg'

import snapbacks from '@/public/images/snapbacks.jpeg'
import fitted from '@/public/images/fitted.jpeg'
import dadHats from '@/public/images/dad hats.jpeg'
import trucker from '@/public/images/truckers.jpeg'
import beanies from '@/public/images/beanies.jpeg'
import bucket from '@/public/images/bucket.jpeg'

import innovationBg from '@/public/images/Futuristic Data Display.png'

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Fiz Cap - premium headwear brand dedicated to delivering stylish, high-quality caps for the modern individual.",
}

const categories = [
  { name: "Snapbacks", description: "Classic adjustable caps with flat brims", src: snapbacks },
  { name: "Fitted Caps", description: "Premium caps for the perfect fit", src: fitted },
  { name: "Dad Hats", description: "Relaxed, unstructured with curved brims", src: dadHats },
  { name: "Trucker Caps", description: "Mesh-back caps for breathability", src: trucker },
  { name: "Beanies", description: "Cozy knit caps for cold weather", src: beanies },
  { name: "Bucket Hats", description: "Trendy all-around brim hats", src: bucket },
]

const values = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Every cap is crafted with meticulous attention to detail using only the finest materials.",
  },
  {
    icon: Heart,
    title: "Passion for Style",
    description: "We believe headwear is more than an accessory - it's a statement of personal identity.",
  },
  {
    icon: Shield,
    title: "Built to Last",
    description: "Durable construction ensures your Fiz Cap stays with you through every adventure.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Join thousands of cap enthusiasts who trust Fiz Cap for their headwear needs.",
  },
]

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Imagery",
    description: "Stunning product visuals generated with cutting-edge AI technology.",
  },
  {
    icon: Zap,
    title: "Seamless Checkout",
    description: "Secure and fast payment processing with Paystack.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast shipping to every corner of Nigeria.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">•Our Story•</p>
            <h1 className="font-serif text-4xl font-light tracking-tight md:text-6xl lg:text-7xl text-balance">
              Premium headwear for the <span className="italic">modern individual</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Fiz Cap is dedicated to delivering stylish, high-quality caps that combine timeless design with
              contemporary trends. Because the perfect cap is more than just an accessory - it's a statement.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="min-w-[180px]">
                <Link href="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[180px] bg-transparent">
                <Link href="/stores">Visit Our Stores</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/6 blur-3xl" />
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
              <Image src={aboutBg} alt="Fiz Cap Style" fill className="object-cover" />
            </div>
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">Our Mission</p>
              <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl lg:text-5xl">
                Making premium caps accessible to everyone
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                To provide exceptional quality headwear that combines timeless design with contemporary trends, making
                premium caps accessible to everyone who values style and craftsmanship.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {values.map((value) => (
                  <div key={value.title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <value.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{value.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="bg-secondary/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">What We Offer</p>
            <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl">Premium Headwear Collection</h2>
            <p className="mt-4 text-muted-foreground">
              Discover our carefully curated selection of caps for every style and occasion.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                href={`/shop?category=${category.name.toLowerCase().replace(" ", "-")}`}
                className="group relative overflow-hidden rounded-2xl bg-background p-8 transition-all hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-muted mb-6">
                  <Image
                    src={category.src}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-medium">{category.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">Our Technology</p>
              <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl lg:text-5xl">
                Powered by innovation
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Fiz Cap leverages cutting-edge technology to enhance your shopping experience, from AI-powered product
                imagery to seamless checkout processes.
              </p>
              <div className="mt-10 space-y-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4 items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="mt-1 text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative order-1 aspect-square overflow-hidden rounded-2xl bg-muted lg:order-2">
              <Image src={innovationBg} alt="Fiz Cap Technology" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="bg-primary text-primary-foreground py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-light tracking-tight md:text-4xl lg:text-5xl">
              Join the Fiz Cap Community
            </h2>
            <p className="mt-6 text-lg opacity-90 leading-relaxed">
              Be the first to know about new releases, get exclusive access to limited editions, and enjoy member-only
              discounts and promotions.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="min-w-[180px]">
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-w-[180px] border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm opacity-70">Follow us with #FizCap and share your style</p>
          </div>
        </div>
      </section>
    </main>
  )
}
