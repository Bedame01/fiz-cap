"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ quantity, onQuantityChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const increase = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={decrease}
        disabled={quantity <= min}
        className="h-10 w-10 bg-transparent"
      >
        <Minus className="w-4 h-4" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <span className="w-12 text-center font-medium tabular-nums">{quantity}</span>
      <Button variant="outline" size="icon" onClick={increase} disabled={quantity >= max} className="h-10 w-10">
        <Plus className="w-4 h-4" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  )
}
