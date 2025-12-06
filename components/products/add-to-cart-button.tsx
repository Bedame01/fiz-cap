"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import type { Product, ProductVariant } from "@/lib/shopify/types"
import { ShoppingBag, Loader2 } from "lucide-react"

interface AddToCartButtonProps extends ButtonProps {
  product: Product
  selectedVariant?: ProductVariant | null
  quantity?: number
  isLoading?: boolean
  onAddToCart?: () => void
}

export function AddToCartButton({
  product,
  selectedVariant,
  quantity = 1,
  isLoading = false,
  onAddToCart,
  ...props
}: AddToCartButtonProps) {
  const hasVariants = product.variants.length > 1
  const needsVariantSelection = hasVariants && !selectedVariant

  const getButtonText = () => {
    if (!product.availableForSale) return "Out of Stock"
    if (needsVariantSelection) return "Select Options"
    return "Add to Cart"
  }

  const isDisabled =
    !product.availableForSale ||
    needsVariantSelection ||
    isLoading ||
    (selectedVariant && !selectedVariant.availableForSale)

  return (
    <Button onClick={onAddToCart} disabled={isDisabled} className="w-full" size="lg" {...props}>
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShoppingBag className="w-5 h-5 mr-2" />}
      {getButtonText()}
    </Button>
  )
}
