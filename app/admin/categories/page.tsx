import { createClient } from "@/lib/supabase/server"
import { CategoriesManager } from "@/components/admin/categories-manager"

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("categories").select("*").order("name")

  return data || []
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Organize your cap collections</p>
      </div>

      <CategoriesManager categories={categories} />
    </div>
  )
}
