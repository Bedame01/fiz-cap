import { createClient } from "@/lib/supabase/server"
import { StoresManager } from "@/components/admin/stores-manager"

async function getStores() {
  const supabase = await createClient()
  const { data } = await supabase.from("store_locations").select("*").order("name")

  return data || []
}

export default async function AdminStoresPage() {
  const stores = await getStores()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Store Locations</h1>
        <p className="text-muted-foreground">Manage your retail locations</p>
      </div>

      <StoresManager stores={stores} />
    </div>
  )
}
