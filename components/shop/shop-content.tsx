"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Product, Category } from "@/lib/types/product"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { LayoutToggle } from "@/components/products/layout-toggle"

interface ShopContentProps {
  products: Product[]
  categories: Category[]
  initialLayout?: "grid" | "list"
  initialColumns?: 2 | 3 | 4
}

export function ShopContent({ products, categories, initialLayout = "grid", initialColumns = 4 }: ShopContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [layout, setLayout] = useState<"grid" | "list">(initialLayout)
  const [columns, setColumns] = useState<2 | 3 | 4>(initialColumns)

  const handleLayoutChange = (newLayout: "grid" | "list") => {
    setLayout(newLayout)
    const params = new URLSearchParams(searchParams.toString())
    params.set("layout", newLayout)
    router.push(`/shop?${params.toString()}`, { scroll: false })
  }

  const handleColumnsChange = (newColumns: 2 | 3 | 4) => {
    setColumns(newColumns)
    const params = new URLSearchParams(searchParams.toString())
    params.set("columns", newColumns.toString())
    router.push(`/shop?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <ProductFilters categories={categories} />
        <LayoutToggle
          layout={layout}
          columns={columns}
          onLayoutChange={handleLayoutChange}
          onColumnsChange={handleColumnsChange}
        />
      </div>
      <ProductGrid products={products} layout={layout} columns={columns} />
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground textDisplay font-medium">No products found matching your criteria.</p>
        </div>
      )}
    </>
  )
}
