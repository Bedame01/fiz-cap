import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Ruler, CheckCircle, Instagram, Mail, Crown } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/lib/types/product"
import { FadeIn } from "@/components/ui/FadeIn"
import HeroCarousel from "@/components/ui/carousel/Carousel"
import { NewsletterSignup } from "@/components/newsletter-signup"
// import SplitText from "@/components/Reactbits/SplitText"
// import heroBG from '@/public/images/heroFeatured.jpeg'
// import CircularText from "@/components/Reactbits/CircularText"
// import CurvedLoop from "@/components/Reactbits/CurvedLoop"

// Cap style categories for the homepage
const capStyles = [
  {
    name: "Snapbacks",
    slug: "snapback",
    description: "Classic adjustable style",
    image: "/black-snapback-cap-product.jpg",
  },
  {
    name: "Fitted Caps",
    slug: "fitted",
    description: "Perfect fit every time",
    image: "/navy-fitted-cap-product.jpg",
  },
  {
    name: "Dad Hats",
    slug: "dad-hat",
    description: "Relaxed & comfortable",
    image: "/vintage-dad-hat-product.jpg",
  },
  {
    name: "Trucker Caps",
    slug: "trucker",
    description: "Breathable mesh back",
    image: "/trucker-cap-mesh-product.jpg",
  },
  {
    name: "Beanies",
    slug: "beanie",
    description: "Cold weather essentials",
    image: "/knit-beanie-hat-product.jpg",
  },
  {
    name: "Bucket Hats",
    slug: "bucket",
    description: "Trendy sun protection",
    image: "/bucket-hat-product.jpg",
  },
]

const socialLinks = [
  // { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  // { icon: Tiktok, href: "https://tiktok.com/Fizcaps", label: "Tiktok" },
  { icon: Instagram, href: "https://instagram.com/Fiz_caps", label: "Instagram" },
  { icon: Mail, href: "mailto:Fizayomi21@gmail.com", label: "Email;" },
]

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured products from database
  const { data: featuredProducts } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*)
    `)
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8)

  // Fetch all categories
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order")

  const transformedProducts: Product[] = (featuredProducts || []).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    short_description: product.short_description,
    price: product.price,
    compare_at_price: product.compare_at_price,
    sku: product.sku,
    inventory_quantity: product.inventory_quantity,
    category_id: product.category_id,
    category: product.category,
    style: product.style,
    material: product.material,
    brand: product.brand || "FIZ CAP",
    color: product.color,
    featured: product.featured,
    status: product.status,
    tags: product.tags,
    images: product.images || [],
    created_at: product.created_at,
    updated_at: product.updated_at,
  }))

  return (
    <main>
      <section className="min-h-[90vh] bg-background/80 flex flex-col-reverse lg:flex-row items-start justify-end" id="up">
        <FadeIn className="heroDisplay lg:flex-[0_0_auto] lg:h-screen lg:sticky lg:top-0 lg:w-[45%] z-1">
          <HeroCarousel />
        </FadeIn>

        <div className="container-wide section-padding ">
          <FadeIn className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-4! md:mb-8!">
            <Crown className="w-4 h-4" />
            Premium Headwear Collection🧢🛍️🛒
            {/* <p className="text-lg md:text-xl text-muted font-medium font-serif italic mb-10 md:mb-13">Premium Headwear Collection🧢🛍️🛒</p> */}
          </FadeIn>

          <FadeIn >
            <h1 className="text-5xl! sm:text-7xl! md:text-8xl! lg:text-7xl! textDisplay mb-10 md:mb-20 lg:mb-25!">•Fiz Cap <br /> Fix your Fit.</h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-2xl/8 md:text-3xl font-medium max-w-2xl mb-12 md:mb-16">
            Discover premium caps, snapbacks, and headwear designed for those who lead. From classic fitted caps to trendy bucket hats — find your crown
            </p>
          </FadeIn>

          <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="btn1 py-5.5">
              <Link href="/shop">
                  Shop All Caps
                  <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="py-5.5">
              <Link href="/account">My Account</Link>
              </Button>
          </div>

          <div className="hidden md:flex gap-8 mt-12 lg:mt-20! ml-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors border-r border-foreground/60 pr-8"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
            <a
              href="https://www.tiktok.com/@fiz_caps?lang=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              // aria-label='Tiktok'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-[23px] stroke-muted-foreground hover:stroke-foreground transition-all">
                <path stroke="inherit" stroke-linejoin="round" d="M16 1.5h-3.5V16c0 1.5 -1.5 3 -3 3s-3 -0.5 -3 -3c0 -2 1.899 -3.339 3.5 -3V9.5c-6.12 0 -7 5 -7 6.5s0.977 6.5 6.5 6.5c4.522 0 6.5 -3.5 6.5 -6v-8c1.146 1.018 2.922 1.357 5 1.5V6.5c-3.017 0 -5 -2.654 -5 -5Z" stroke-width="1.8"></path>
              </svg>
            </a>
          </div>

          {/* <CurvedLoop 
            marqueeText="Welcome ✦ To ✦ Fiz ✦ Cap ✦ Shop ✦"
            speed={3}
            curveAmount={300}
            direction="right"
            interactive={true}
            className="custom-text-style text-foreground font-medium lg:hidden"
          /> */}
        </div>
      </section>

      {/* Features - Updated currency text to Naira */}
      <section className="border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-foreground/8 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-bold tracking-tight">Exclusive Styles</h3>
                <p className="text-sm text-muted-foreground">Premium headwear collection</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-foreground/8 flex items-center justify-center flex-shrink-0">
                <Ruler className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-bold tracking-tight">Perfect Fit Guaranteed</h3>
                <p className="text-sm text-muted-foreground">Perfect fit every time</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-foreground/8 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-bold tracking-tight">Quality Guarantee</h3>
                <p className="text-sm text-muted-foreground">Premium materials only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Style */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl tracking-tight uppercase">Shop by <span className="font-bold">Style</span></h2>
              <p className="text-muted-foreground mt-2">Find the perfect cap for your look</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/shop">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {capStyles.map((style) => (
              <Link
                key={style.slug}
                href={`/shop?style=${style.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden bg-secondary"
              >
                <Image
                  src={style.image || "/placeholder.svg"}
                  alt={style.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-white text-sm">{style.name}</h3>
                  <p className="text-xs text-white/70">{style.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="py-5 px-4">
              <Link href="/shop">
                View All Styles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products - Use proper Product type with ProductCard */}
      {transformedProducts.length > 0 && (
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl tracking-tight uppercase">Featured <span className="font-bold">Caps</span></h2>
                <p className="text-muted-foreground mt-2">Our most popular headwear this season</p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/shop?featured=true">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-sm:px-2">
              {transformedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild className="py-5 px-4">
                <Link href="/shop?featured=true">
                  View All Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      {categories && categories.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight textDisplay">Browse Categories</h2>
              <p className="text-muted-foreground mt-2">Explore our full collection of headwear</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="group p-6 border rounded-xl hover:border-foreground/20 transition-colors"
                >
                  <h3 className="font-semibold group-hover:text-foreground transition-colors">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
                  )}
                  <span className="inline-flex items-center text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-foreground text-background rounded-2xl p-8 sm:p-12 lg:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-balance">Join the FIZ CAP Crew</h2>
            <p className="text-background/80 max-w-2xl mx-auto mb-8">
              Subscribe to get exclusive drops, early access to new releases, and member-only discounts on premium
              headwear.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </main>
  )
}
