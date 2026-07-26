"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const RATING_BREAKDOWN = [
  { stars: 5, percent: 72 },
  { stars: 4, percent: 18 },
  { stars: 3, percent: 6 },
  { stars: 2, percent: 3 },
  { stars: 1, percent: 1 },
]

const FEATURED_REVIEW = {
  name: "Alex Mathio",
  rating: 5,
  date: "12 Oct 2024",
  body: "Great quality cap — fits perfectly and the material feels premium. Shipping was faster than expected. Would definitely order again.",
}

interface ProductReviewsProps {
  productName: string
}

export function ProductReviews({ productName }: ProductReviewsProps) {
  return (
    <section className="mt-20 pt-12 border-t border-border/60">
      <h2 className="text-2xl font-semibold tracking-tight mb-10">Ratings &amp; Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-semibold tracking-tight">4.5</span>
            <span className="text-2xl text-muted-foreground">/ 5</span>
          </div>
          <p className="text-sm text-muted-foreground mb-8">(50 reviews for {productName})</p>

          <div className="space-y-2.5">
            {RATING_BREAKDOWN.map(({ stars, percent }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-3 tabular-nums">{stars}</span>
                <Star className="h-3.5 w-3.5 fill-foreground text-foreground shrink-0" />
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-foreground transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 tabular-nums">{percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">{FEATURED_REVIEW.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{FEATURED_REVIEW.date}</p>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < FEATURED_REVIEW.rating
                      ? "fill-foreground text-foreground"
                      : "text-muted-foreground/30",
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{FEATURED_REVIEW.body}</p>
          <div className="flex justify-center gap-1.5 mt-6">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  dot === 0 ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/30",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
