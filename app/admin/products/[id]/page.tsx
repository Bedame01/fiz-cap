import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

async function getProduct(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("products").select("*, product_images(id, url, position)").eq("id", id).single()

  return data
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("categories").select("*").order("name")
  return data || []
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories] = await Promise.all([getProduct(id), getCategories()])

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update product details</p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  )
}
