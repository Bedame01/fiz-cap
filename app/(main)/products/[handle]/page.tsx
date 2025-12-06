import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ImageGallery } from "@/components/products/image-gallery"
import { ProductDetails } from "@/components/products/product-details"
import { ProductGrid } from "@/components/products/product-grid"
import type { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("name, description, images:product_images(url)")
    .eq("slug", handle)
    .single()

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description || "",
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params
  const supabase = await createClient()

  // Fetch the product with all related data
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq("slug", handle)
    .eq("status", "active")
    .single()

  if (!product) {
    notFound()
  }

  // Sort images by position
  if (product.images) {
    product.images.sort((a: any, b: any) => a.position - b.position)
  }

  // Fetch related products from same category
  let relatedProducts: any[] = []
  if (product.category_id) {
    const { data } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*)
      `)
      .eq("status", "active")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .limit(4)

    relatedProducts = data || []
  }

  // If not enough related products, fetch featured ones
  if (relatedProducts.length < 4) {
    const { data } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*)
      `)
      .eq("status", "active")
      .eq("featured", true)
      .neq("id", product.id)
      .limit(4 - relatedProducts.length)

    if (data) {
      relatedProducts = [...relatedProducts, ...data]
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <ImageGallery images={product.images || []} title={product.name} />

        {/* Product Details */}
        <ProductDetails product={product} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-16 border-t">
          <h2 className="text-2xl font-bold tracking-tight mb-8">You may also like</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </div>
  )
}
