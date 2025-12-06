import { createClient } from "@/lib/supabase/server"
import { CustomersTable } from "@/components/admin/customers-table"

async function getCustomers() {
  const supabase = await createClient()
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return data || []
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your customer base</p>
      </div>

      <CustomersTable customers={customers} />
    </div>
  )
}
