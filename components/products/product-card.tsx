"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types/product"
import { formatPrice } from "@/lib/types/product"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { toast } from "sonner"

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
      const result = addItem(product)

      if (result.wasLimited) {
        if (result.added > 0) {
          toast.warning(`Only ${result.added} item${result.added !== 1 ? "s" : ""} added due to availability`)
        } else {
          toast.error(`Cannot add more. Only ${result.available} available in stock`)
        }
      } else {
        toast.success(`${product.name} added to cart`)
      }
    }
  }

  if (layout === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
        <Link
          href={`/products/${product.slug}`}
          className="relative w-32 h-36 flex-shrink-0 bg-secondary overflow-hidden"
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
            {/* <ShoppingBag className="w-4 h-4 mr-2" /> */}
            <svg className="icon icon-cart size-4 mr-2 fill-background" role="img" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="cart-icon">
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
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-ratio overflow-hidden bg-secondary mb-4">
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
            <Button className="w-full py-5" size="sm" onClick={handleQuickAdd} disabled={!inStock}>
              {/* <ShoppingBag className="w-4 h-4 mr-2" /> */}
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
