import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/components/admin/products-table"

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(name), product_images(url, position)")
    .order("created_at", { ascending: false })

  return data || []
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your cap inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
