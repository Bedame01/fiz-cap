"use client"

import { useState } from "react"
import type { Product, ProductVariant } from "@/lib/types/product"
import { formatPrice } from "@/lib/types/product"
import { VariantSelector } from "./variant-selector"
import { QuantitySelector } from "./quantity-selector"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-context"
import { Truck, RefreshCw, Shield, ShoppingBag, Heart, Share2, Loader2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null,
  )
  const [isAdding, setIsAdding] = useState(false)
  const [localWarning, setLocalWarning] = useState<string | null>(null)
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
    setLocalWarning(null)

    try {
      const result = addItem(product, selectedVariant, quantity)

      if (result.wasLimited) {
        setLocalWarning(`Only ${result.available} items were added to your cart due to availability.`)
        setTimeout(() => setLocalWarning(null), 5000)
        toast.warning(`Only ${result.available} items available`)
      } else {
        toast.success(`${product.name} added to cart`)
      }

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
      {localWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{localWarning}</AlertDescription>
        </Alert>
      )}

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
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2 textDisplay">{product.name}</h1>
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
          <Button className="flex-1 py-5.5" size="lg" onClick={handleAddToCart} disabled={!inStock || isAdding}>
            {isAdding ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 
              <svg className="icon icon-cart size-4 fill-background mr-1" role="img" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="cart-icon">
                <title id="cart-icon">Cart</title>
                <g clip-path="url(#clip0_738:3282)">
                <path d="M22.4717 23.9989H0.524841C0.455894 23.9998 0.387406 23.9876 0.323371 23.963C0.259337 23.9384 0.200993 23.9018 0.151663 23.8555C0.102333 23.8091 0.0629937 23.7538 0.0359119 23.6928C0.00883007 23.6318 -0.00547204 23.5663 -0.00616455 23.4999V8.2669C-0.00547204 8.20056 0.00883007 8.135 0.0359119 8.07399C0.0629937 8.01297 0.102333 7.95768 0.151663 7.91132C0.200993 7.86496 0.259337 7.82845 0.323371 7.80384C0.387406 7.77923 0.455894 7.76698 0.524841 7.76788H22.4717C22.5407 7.76687 22.6092 7.77896 22.6733 7.80353C22.7374 7.8281 22.7958 7.86463 22.8451 7.91101C22.8945 7.95739 22.9338 8.01271 22.9609 8.07378C22.9879 8.13485 23.0021 8.20053 23.0027 8.2669V23.4999C23.002 23.5663 22.9877 23.6318 22.9606 23.6928C22.9335 23.7538 22.8942 23.8091 22.8449 23.8555C22.7956 23.9018 22.7372 23.9384 22.6731 23.963C22.6091 23.9876 22.5407 23.9998 22.4717 23.9989ZM1.05579 23.0002H21.9408V8.76582H1.05579V23.0002Z" fill="inherit"></path>
                <path d="M16.3355 8.63991C16.19 8.63991 16.0504 8.58425 15.9475 8.48525C15.8446 8.38624 15.7868 8.25201 15.7868 8.11199C15.7868 3.62807 14.224 1.05574 11.4992 1.05574C8.7744 1.05574 7.21159 3.62807 7.21159 8.11199C7.21159 8.25201 7.15375 8.38624 7.05085 8.48525C6.94795 8.58425 6.80844 8.63991 6.66293 8.63991C6.51741 8.63991 6.37784 8.58425 6.27495 8.48525C6.17205 8.38624 6.11426 8.25201 6.11426 8.11199C6.11426 3.03288 8.1275 0.000732422 11.4992 0.000732422C14.8709 0.000732422 16.8842 3.03288 16.8842 8.11199C16.8842 8.25201 16.8264 8.38624 16.7235 8.48525C16.6206 8.58425 16.481 8.63991 16.3355 8.63991Z" fill="inherit"></path>
                <path d="M18.978 16.8235C18.8325 16.8235 18.6929 16.7679 18.59 16.6689C18.4871 16.5699 18.4293 16.4356 18.4293 16.2956V11.655H12.8045C12.659 11.655 12.5194 11.5994 12.4165 11.5004C12.3137 11.4014 12.2559 11.2671 12.2559 11.127C12.2559 10.987 12.3137 10.8528 12.4165 10.7538C12.5194 10.6548 12.659 10.5991 12.8045 10.5991H18.978C19.1235 10.5991 19.2631 10.6548 19.366 10.7538C19.4689 10.8528 19.5267 10.987 19.5267 11.127V16.2956C19.5267 16.3649 19.5125 16.4335 19.4849 16.4976C19.4573 16.5616 19.4169 16.6199 19.366 16.6689C19.315 16.7179 19.2545 16.7568 19.1879 16.7833C19.1214 16.8098 19.05 16.8235 18.978 16.8235Z" fill="inherit"></path>
                </g>
                <defs>
                <clipPath id="clip0_738:3282">
                <rect width="23" height="24" fill="white"></rect>
                </clipPath>
                </defs>
              </svg>
              }
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button variant="outline" size="lg" className="px-4 py-5.5 bg-transparent">
            <Heart className="w-5 h-5" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          <Button variant="outline" size="lg" className="px-4 py-5.5 bg-transparent" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      {/* Features */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-b mb-8">
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
      </div> */}

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
