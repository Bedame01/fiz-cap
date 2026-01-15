"use client"

import type { ProductVariant } from "@/lib/types/product"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onVariantChange: (variant: ProductVariant) => void
}

export function VariantSelector({ variants, selectedVariant, onVariantChange }: VariantSelectorProps) {
  useEffect(() => {
    if (!selectedVariant && variants.length > 0) {
      const firstAvailable = variants.find((v) => v.inventory_quantity > 0) || variants[0]
      onVariantChange(firstAvailable)
    }
  }, [variants, selectedVariant, onVariantChange])

  // Group variants by size and color
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))]

  const handleSizeChange = (size: string) => {
    const variant =
      variants.find((v) => v.size === size && (selectedVariant?.color ? v.color === selectedVariant.color : true)) ||
      variants.find((v) => v.size === size)

    if (variant) onVariantChange(variant)
  }

  const handleColorChange = (color: string) => {
    const variant =
      variants.find((v) => v.color === color && (selectedVariant?.size ? v.size === selectedVariant.size : true)) ||
      variants.find((v) => v.color === color)

    if (variant) onVariantChange(variant)
  }

  const handleVariantSelect = (variantId: string) => {
    const variant = variants.find((v) => v.id === variantId)
    if (variant) onVariantChange(variant)
  }

  const isVariantAvailable = (size?: string | null, color?: string | null) => {
    return variants.some((v) => (!size || v.size === size) && (!color || v.color === color) && v.inventory_quantity > 0)
  }

  // Format variant label for dropdown
  const formatVariantLabel = (variant: ProductVariant) => {
    const parts = []
    if (variant.size) parts.push(`Size: ${variant.size}`)
    if (variant.color) parts.push(`Color: ${variant.color}`)
    if (parts.length === 0) parts.push("Default")

    const stock = variant.inventory_quantity > 0 ? `(${variant.inventory_quantity} in stock)` : "(Out of stock)"
    return `${parts.join(" • ")} ${stock}`
  }

  return (
    <div className="space-y-6">
      {/* Variant Dropdown Selector */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Select Variant <span className="text-red-500">*</span>
        </label>
        <Select value={selectedVariant?.id} onValueChange={handleVariantSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose size and color" />
          </SelectTrigger>
          <SelectContent>
            {variants.map((variant) => (
              <SelectItem
                key={variant.id}
                value={variant.id}
                disabled={variant.inventory_quantity === 0}
                className={cn(variant.inventory_quantity === 0 && "opacity-50 line-through")}
              >
                {formatVariantLabel(variant)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedVariant && (
          <p className="text-xs text-muted-foreground mt-2">
            {selectedVariant.inventory_quantity} {selectedVariant.inventory_quantity === 1 ? "item" : "items"} available
          </p>
        )}
      </div>

      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">
            Size <span className="text-red-500">*</span>
            {selectedVariant?.size && (
              <span className="ml-2 font-normal text-muted-foreground">- {selectedVariant.size}</span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedVariant?.size === size
              const isAvailable = isVariantAvailable(size, selectedVariant?.color)

              return (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size!)}
                  disabled={!isAvailable}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium border-2 rounded-lg transition-all",
                    isSelected
                      ? "border-foreground bg-foreground text-background shadow-sm"
                      : "border-border hover:border-foreground bg-background",
                    !isAvailable && "opacity-40 cursor-not-allowed line-through",
                  )}
                >
                  {size}
                  {isSelected && <Check className="absolute top-1 right-1 h-3 w-3" />}
                </button>
              )
            })}
          </div>
          {!selectedVariant && <p className="text-xs text-muted-foreground mt-2">Please select a size to continue</p>}
        </div>
      )}

      {/* Color selector */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">
            Color
            {selectedVariant?.color && (
              <span className="ml-2 font-normal text-muted-foreground">- {selectedVariant.color}</span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isSelected = selectedVariant?.color === color
              const isAvailable = isVariantAvailable(selectedVariant?.size, color)

              return (
                <button
                  key={color}
                  onClick={() => handleColorChange(color!)}
                  disabled={!isAvailable}
                  className={cn(
                    "relative px-5 py-2 text-sm font-medium border-2 rounded-lg transition-all",
                    isSelected
                      ? "border-foreground bg-foreground text-background shadow-sm"
                      : "border-border hover:border-foreground bg-background",
                    !isAvailable && "opacity-40 cursor-not-allowed line-through",
                  )}
                >
                  {color}
                  {isSelected && <Check className="absolute top-1 right-1 h-3 w-3" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
