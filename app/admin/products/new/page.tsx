import { ProductForm } from "@/components/admin/product-form"
import { createClient } from "@/lib/supabase/server"

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("categories").select("*").order("name")
  return data || []
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new cap for your store</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
