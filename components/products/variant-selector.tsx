"use client"

import type { ProductVariant } from "@/lib/types/product"
import { cn } from "@/lib/utils"

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onVariantChange: (variant: ProductVariant) => void
}

export function VariantSelector({ variants, selectedVariant, onVariantChange }: VariantSelectorProps) {
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

  const isVariantAvailable = (size?: string | null, color?: string | null) => {
    return variants.some((v) => (!size || v.size === size) && (!color || v.color === color) && v.inventory_quantity > 0)
  }

  return (
    <div className="space-y-6">
      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">Size</label>
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
                    "px-4 py-2 text-sm border rounded-md transition-all",
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground",
                    !isAvailable && "opacity-50 cursor-not-allowed line-through",
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-3">
            Color{" "}
            {selectedVariant?.color && (
              <span className="font-normal text-muted-foreground">- {selectedVariant.color}</span>
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
                    "px-4 py-2 text-sm border rounded-md transition-all",
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground",
                    !isAvailable && "opacity-50 cursor-not-allowed line-through",
                  )}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
