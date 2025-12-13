import { createClient } from "@/lib/supabase/server"
import { StoreMap } from "@/components/stores/store-map"
import { StoreList } from "@/components/stores/store-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Store Locations",
  description: "Find a MINIMAL store near you.",
}

export default async function StoresPage() {
  const supabase = await createClient()
  const { data: stores } = await supabase.from("store_locations").select("*").order("name")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 textDisplay">Our Stores</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Visit one of our flagship locations to experience our products in person. Our knowledgeable staff is ready to
          help you find exactly what you need.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store List */}
        <div className="order-2 lg:order-1">
          <StoreList stores={stores || []} />
        </div>

        {/* Map */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <StoreMap stores={stores || []} />
        </div>
      </div>
    </div>
  )
}
