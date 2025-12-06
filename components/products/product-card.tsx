"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types/product"
import { formatPrice } from "@/lib/types/product"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"

interface ProductCardProps {
  product: Product
  layout?: "grid" | "list"
}

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const { addItem } = useCart()
  const image = product.images?.[0]
  const isOnSale = product.compare_at_price && product.compare_at_price > product.price
  const inStock = product.inventory_quantity > 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inStock) {
      addItem(product)
    }
  }

  if (layout === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
        <Link
          href={`/products/${product.slug}`}
          className="relative w-32 h-32 flex-shrink-0 bg-secondary rounded-md overflow-hidden"
        >
          {image ? (
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt_text || product.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">No image</div>
          )}
          {isOnSale && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 text-xs font-medium rounded">
              SALE
            </span>
          )}
        </Link>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-medium text-foreground hover:underline underline-offset-4">{product.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.short_description || product.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-foreground font-medium">{formatPrice(product.price)}</span>
              {isOnSale && (
                <span className="text-muted-foreground line-through text-sm">
                  {formatPrice(product.compare_at_price!)}
                </span>
              )}
            </div>
          </div>
          <Button size="sm" className="w-fit mt-2" onClick={handleQuickAdd} disabled={!inStock}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary mb-4">
          {image ? (
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt_text || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">No image</div>
          )}
          {isOnSale && (
            <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
              SALE
            </span>
          )}
          {!inStock && (
            <span className="absolute top-3 left-3 bg-muted text-muted-foreground px-2 py-1 text-xs font-medium rounded">
              SOLD OUT
            </span>
          )}
          {/* Quick add button */}
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button className="w-full" size="sm" onClick={handleQuickAdd} disabled={!inStock}>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-foreground group-hover:underline underline-offset-4 transition-all line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-foreground">{formatPrice(product.price)}</span>
            {isOnSale && (
              <span className="text-muted-foreground line-through text-sm">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
