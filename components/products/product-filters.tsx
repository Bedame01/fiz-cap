"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category } from "@/lib/types/product"
import { X } from "lucide-react"

interface ProductFiltersProps {
  categories: Category[]
}

const sortOptions = [
  { value: "relevance", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
]

const styleOptions = [
  { value: "all", label: "All Styles" },
  { value: "snapback", label: "Snapbacks" },
  { value: "fitted", label: "Fitted Caps" },
  { value: "dad-hat", label: "Dad Hats" },
  { value: "trucker", label: "Trucker Caps" },
  { value: "beanie", label: "Beanies" },
  { value: "bucket", label: "Bucket Hats" },
  { value: "visor", label: "Visors" },
]

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || ""
  const currentStyle = searchParams.get("style") || ""
  const currentSort = searchParams.get("sort") || "relevance"

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/shop?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/shop")
  }

  const hasFilters = currentCategory || currentStyle || currentSort !== "relevance"

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={currentStyle || "all"} onValueChange={(value) => updateFilter("style", value)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Styles" />
        </SelectTrigger>
        <SelectContent>
          {styleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentCategory || "all"} onValueChange={(value) => updateFilter("category", value)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentSort} onValueChange={(value) => updateFilter("sort", value)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}
