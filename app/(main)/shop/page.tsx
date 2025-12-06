import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ShopContent } from "@/components/shop/shop-content"
import { SearchBar } from "@/components/products/search-bar"

interface ShopPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    style?: string
    sort?: string
    featured?: string
    layout?: string
    columns?: string
  }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Fetch categories for filters
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order")

  // Build product query
  let query = supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq("status", "active")

  // Apply filters
  if (params.category) {
    const { data: category } = await supabase.from("categories").select("id").eq("slug", params.category).single()
    if (category) {
      query = query.eq("category_id", category.id)
    }
  }

  if (params.style) {
    query = query.eq("style", params.style)
  }

  if (params.featured === "true") {
    query = query.eq("featured", true)
  }

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }

  // Apply sorting
  switch (params.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    default:
      query = query.order("featured", { ascending: false }).order("created_at", { ascending: false })
  }

  const { data: products } = await query.limit(24)

  // Determine page title based on filters
  let title = "Shop All Caps"
  let description = "Browse our complete collection of premium headwear"

  if (params.style) {
    const styleNames: Record<string, string> = {
      snapback: "Snapbacks",
      fitted: "Fitted Caps",
      "dad-hat": "Dad Hats",
      trucker: "Trucker Caps",
      beanie: "Beanies",
      bucket: "Bucket Hats",
      visor: "Visors",
    }
    title = styleNames[params.style] || "Shop"
    description = `Browse our collection of ${title.toLowerCase()}`
  }

  if (params.featured === "true") {
    title = "Featured Caps"
    description = "Our hand-picked selection of premium headwear"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>

      {/* Products */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-secondary rounded-lg mb-4" />
                <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/4" />
              </div>
            ))}
          </div>
        }
      >
        <ShopContent
          products={products || []}
          categories={categories || []}
          initialLayout={(params.layout as "grid" | "list") || "grid"}
          initialColumns={(Number(params.columns) as 2 | 3 | 4) || 4}
        />
      </Suspense>
    </div>
  )
}
