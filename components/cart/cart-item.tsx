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

  const availableStock = variant?.inventory_quantity ?? product.inventory_quantity
  const isAtMaxStock = quantity >= availableStock

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
            disabled={isLoading || isAtMaxStock}
            title={isAtMaxStock ? `Only ${availableStock} available` : undefined}
          >
            <Plus className="w-3 h-3" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
        {isAtMaxStock && 
          <p className="text-xs text-foreground mt-2 flex items-center gap-1">
            <svg className="icon icon-error size-4" viewBox="0 0 13 13">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="#fff" stroke-width="var(--icon-stroke-width)"></circle>
              <circle cx="6.5" cy="6.5" r="5.5" fill="#EB001B" stroke="#EB001B" stroke-width=".7"></circle>
              <path fill="#fff" d="m5.874 3.528.1 4.044h1.053l.1-4.044zm.627 6.133c.38 0 .68-.288.68-.656s-.3-.656-.68-.656-.681.288-.681.656.3.656.68.656"></path>
              <path fill="#fff" stroke="#EB001B" stroke-width=".7" d="M5.874 3.178h-.359l.01.359.1 4.044.008.341h1.736l.008-.341.1-4.044.01-.359H5.873Zm.627 6.833c.56 0 1.03-.432 1.03-1.006s-.47-1.006-1.03-1.006-1.031.432-1.031 1.006.47 1.006 1.03 1.006Z"></path>
            </svg>
            Only {availableStock} item was added to your cart due to availability.
          </p>
        }
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
