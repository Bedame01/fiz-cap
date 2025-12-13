import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, RefreshCw, Shield, Crown } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/lib/types/product"
import SplitText from "@/components/Reactbits/SplitText"
import heroBG from '@/public/images/Stylish Cap Close-Up.png'

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
      {/* Hero Section */}
      <section className="relative bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 py-16 lg:py-24 items-center">
            <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                    <Crown className="w-4 h-4" />
                    Premium Headwear Collection
                </span>
                {/* <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
                    Top Off Your Style
                </h1> */}
                <SplitText
                    text="Welcome to FIZ CAP,"
                    className="text-4xl sm:text-5xl lg:text-[40px] xl:text-5xl font-bold tracking-tight text-balance textDisplay"
                    delay={100}
                    duration={0.7}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="left"
                    // onLetterAnimationComplete={() => {}}
                />
                <SplitText
                    text="order to fix your fit."
                    className="text-4xl sm:text-5xl lg:text-[40px] xl:text-5xl font-bold tracking-tight text-balance mb-6 textDisplay"
                    delay={100}
                    duration={0.7}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="left"
                    // onLetterAnimationComplete={() => {}}
                />
                <p className="text-lg text-muted-foreground mb-8 text-pretty">
                    Discover premium caps, snapbacks, and headwear designed for those who lead. From classic fitted caps to
                    trendy bucket hats — find your crown.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button size="lg" asChild className="hover:bg-(--primary-color)!">
                    <Link href="/shop">
                        Shop All Caps
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                    <Link href="/shop?style=snapback">Shop Snapbacks</Link>
                    </Button>
                </div>
            </div>
            <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-secondary">
              <Image
                src={heroBG}
                alt="FIZ CAP featured collection"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features - Updated currency text to Naira */}
      <section className="border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over ₦50,000</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium">Quality Guarantee</h3>
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
              <h2 className="text-3xl font-bold tracking-tight textDisplay">Shop by Style</h2>
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
            <Button variant="outline" asChild>
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
                <h2 className="text-3xl font-bold tracking-tight textDisplay">Featured Caps</h2>
                <p className="text-muted-foreground mt-2">Our most popular headwear this season</p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/shop?featured=true">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {transformedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
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
              <h2 className="text-3xl font-bold tracking-tight textDisplay">Browse Categories</h2>
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
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">Join the FIZ CAP Crew</h2>
            <p className="text-background/80 max-w-2xl mx-auto mb-8">
              Subscribe to get exclusive drops, early access to new releases, and member-only discounts on premium
              headwear.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-background/50"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
