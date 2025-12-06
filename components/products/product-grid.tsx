"use client"

import type { Product } from "@/lib/types/product"
import { ProductCard } from "./product-card"
import { cn } from "@/lib/utils"

interface ProductGridProps {
  products: Product[]
  layout?: "grid" | "list"
  columns?: 2 | 3 | 4
}

export function ProductGrid({ products, layout = "grid", columns = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">No products found</p>
        <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    )
  }

  if (layout === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} layout="list" />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layout="grid" />
      ))}
    </div>
  )
}
