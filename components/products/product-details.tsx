"use client"

import { useState } from "react"
import type { Product, ProductVariant } from "@/lib/types/product"
import { formatPrice } from "@/lib/types/product"
import { VariantSelector } from "./variant-selector"
import { QuantitySelector } from "./quantity-selector"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-context"
import { Truck, RefreshCw, Shield, ShoppingBag, Heart, Share2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null,
  )
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const currentPrice = product.price + (selectedVariant?.price_adjustment || 0)
  const comparePrice = product.compare_at_price
    ? product.compare_at_price + (selectedVariant?.price_adjustment || 0)
    : null
  const isOnSale = comparePrice && comparePrice > currentPrice
  const inStock = selectedVariant ? selectedVariant.inventory_quantity > 0 : product.inventory_quantity > 0
  const stockCount = selectedVariant?.inventory_quantity ?? product.inventory_quantity

  const handleAddToCart = async () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error("Please select a size")
      return
    }

    setIsAdding(true)
    try {
      addItem(product, selectedVariant, quantity)
      toast.success(`${product.name} added to cart`)
      setQuantity(1)
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.short_description || product.description || "",
        url: window.location.href,
      })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    }
  }

  return (
    <div className="flex flex-col">
      {/* Category & Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {product.category && <Badge variant="secondary">{product.category.name}</Badge>}
        {product.style && (
          <Badge variant="outline" className="capitalize">
            {product.style.replace("-", " ")}
          </Badge>
        )}
        {isOnSale && <Badge className="bg-red-500">Sale</Badge>}
      </div>

      {/* Title & Price */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{product.name}</h1>
        {product.brand && <p className="text-sm text-muted-foreground mb-4">by {product.brand}</p>}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-medium text-foreground">{formatPrice(currentPrice)}</span>
          {isOnSale && comparePrice && (
            <span className="text-lg text-muted-foreground line-through">{formatPrice(comparePrice)}</span>
          )}
        </div>

        {/* Stock status */}
        <div className="mt-2">
          {inStock ? (
            <p className="text-sm text-green-600">
              {stockCount <= 5 ? `Only ${stockCount} left in stock` : "In stock"}
            </p>
          ) : (
            <p className="text-sm text-red-500">Out of stock</p>
          )}
        </div>
      </div>

      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="mb-6">
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
          />
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-3">Quantity</label>
          <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} max={stockCount} />
        </div>

        <div className="flex gap-3">
          <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={!inStock || isAdding}>
            {isAdding ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShoppingBag className="w-5 h-5 mr-2" />}
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button variant="outline" size="lg" className="px-4 bg-transparent">
            <Heart className="w-5 h-5" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          <Button variant="outline" size="lg" className="px-4 bg-transparent" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-b mb-8">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="w-5 h-5 text-muted-foreground" />
          <span>Free shipping over ₦50,000</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RefreshCw className="w-5 h-5 text-muted-foreground" />
          <span>30-day returns</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <span>1-year warranty</span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Description</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p>{product.description || product.short_description || "No description available."}</p>
        </div>

        {/* Product details */}
        {(product.material || product.color || product.sku) && (
          <div className="mt-6 space-y-2 text-sm">
            <h3 className="font-medium text-foreground">Product Details</h3>
            {product.material && (
              <p>
                <span className="text-muted-foreground">Material:</span> {product.material}
              </p>
            )}
            {product.color && (
              <p>
                <span className="text-muted-foreground">Color:</span> {product.color}
              </p>
            )}
            {product.sku && (
              <p>
                <span className="text-muted-foreground">SKU:</span> {product.sku}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
