"use client"

import type { Product } from "@/lib/types/product"
import { formatPrice } from "@/lib/types/product"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tag, Package, Truck, CalendarDays } from "lucide-react"

interface ProductAccordionsProps {
  product: Product
  freeShippingThreshold?: number
  estimatedDays?: string
}

function getEstimatedArrival(daysMin = 3, daysMax = 5): string {
  const start = new Date()
  const end = new Date()
  start.setDate(start.getDate() + daysMin)
  end.setDate(end.getDate() + daysMax)
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
  return `${fmt(start)} – ${fmt(end)}`
}

function parseEstimatedDays(estimatedDays: string): [number, number] {
  const match = estimatedDays.match(/(\d+)\s*[-–]\s*(\d+)/)
  if (match) return [Number(match[1]), Number(match[2])]
  const single = estimatedDays.match(/(\d+)/)
  if (single) return [Number(single[1]), Number(single[1]) + 2]
  return [3, 5]
}

export function ProductAccordions({
  product,
  freeShippingThreshold = 50000,
  estimatedDays = "3-5 business days",
}: ProductAccordionsProps) {
  const isOnSale =
    product.compare_at_price != null && product.compare_at_price > product.price
  const discountPercent = isOnSale
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : 0
  const [daysMin, daysMax] = parseEstimatedDays(estimatedDays)

  const shippingItems = [
    {
      icon: Tag,
      label: "Discount",
      value: isOnSale ? `Save ${discountPercent}%` : "Standard pricing",
    },
    {
      icon: Package,
      label: "Package",
      value: "Regular packaging",
    },
    {
      icon: Truck,
      label: "Delivery time",
      value: estimatedDays,
    },
    {
      icon: CalendarDays,
      label: "Est. arrival",
      value: getEstimatedArrival(daysMin, daysMax),
    },
  ]

  return (
    <Accordion type="multiple" defaultValue={["description", "shipping"]} className="w-full">
      <AccordionItem value="description" className="border-border/60">
        <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
          Description &amp; Fit
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description || product.short_description || "No description available."}
          </p>
          {(product.material || product.color || product.style || product.sku) && (
            <dl className="mt-4 grid gap-2 text-sm">
              {product.material && (
                <div className="flex gap-2">
                  <dt className="text-muted-foreground min-w-20">Material</dt>
                  <dd>{product.material}</dd>
                </div>
              )}
              {product.color && (
                <div className="flex gap-2">
                  <dt className="text-muted-foreground min-w-20">Color</dt>
                  <dd>{product.color}</dd>
                </div>
              )}
              {product.style && (
                <div className="flex gap-2">
                  <dt className="text-muted-foreground min-w-20">Style</dt>
                  <dd className="capitalize">{product.style.replace("-", " ")}</dd>
                </div>
              )}
              {product.sku && (
                <div className="flex gap-2">
                  <dt className="text-muted-foreground min-w-20">SKU</dt>
                  <dd>{product.sku}</dd>
                </div>
              )}
            </dl>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shipping" className="border-border/60">
        <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
          Shipping
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="grid grid-cols-2 gap-3">
            {shippingItems.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/30 p-3"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free shipping on orders over {formatPrice(freeShippingThreshold)}.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
