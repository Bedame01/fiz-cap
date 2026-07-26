"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types/product"
import { formatPrice } from "@/lib/types/product"
import { Star } from "lucide-react"

interface RelatedProductCardProps {
  product: Product
}

export function RelatedProductCard({ product }: RelatedProductCardProps) {
  const image = product.images?.[0]
  const isOnSale = product.compare_at_price != null && product.compare_at_price > product.price
  const discountPercent = isOnSale
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : 0

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary mb-3">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt_text || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>
      <h3 className="font-medium text-foreground line-clamp-1 group-hover:underline underline-offset-4">
        {product.name}
      </h3>
      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <Star className="h-3 w-3 fill-foreground text-foreground" />
        <span>4.0/5</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
        {isOnSale && (
          <>
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
            <span className="text-sm font-medium text-red-500">-{discountPercent}%</span>
          </>
        )}
      </div>
    </Link>
  )
}
