"use client"

import Image from "next/image"
import Link from "next/link"
import type { CartItem as CartItemType } from "@/lib/types/product"
import { formatPrice } from "@/lib/types/product"
import { Button } from "@/components/ui/button"
import { Minus, Plus, X } from "lucide-react"
import { useCart } from "./cart-context"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateItemQuantity, removeItem, isLoading } = useCart()
  const { product, variant, quantity } = item
  const image = product.images?.[0]
  const itemPrice = product.price + (variant?.price_adjustment || 0)
  const lineTotal = itemPrice * quantity
 
  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative w-20 h-20 flex-shrink-0 bg-secondary rounded-md overflow-hidden"
      >
        {image ? (
          <Image
            src={image.url || "/placeholder.svg"}
            alt={image.alt_text || product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${product.slug}`}
          className="font-medium hover:underline underline-offset-4 line-clamp-1"
        >
          {product.name}
        </Link>
        {variant && (variant.size || variant.color) && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {[variant.size, variant.color].filter(Boolean).join(" / ")}
          </p>
        )}
        <p className="text-sm font-medium mt-1">{formatPrice(itemPrice)}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-transparent"
            onClick={() => updateItemQuantity(item.id, quantity - 1)}
            disabled={isLoading}
          >
            <Minus className="w-3 h-3" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 bg-transparent"
            onClick={() => updateItemQuantity(item.id, quantity + 1)}
            disabled={isLoading}
          >
            <Plus className="w-3 h-3" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Price & Remove */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 -mr-2 -mt-1"
          onClick={() => removeItem(item.id)}
          disabled={isLoading}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Remove item</span>
        </Button>
        <span className="font-medium">{formatPrice(lineTotal)}</span>
      </div>
    </div>
  )
}
