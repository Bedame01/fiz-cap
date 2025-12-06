"use client"

import Image from "next/image"
import { useState } from "react"
import type { ProductImage } from "@/lib/types/product"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface ImageGalleryProps {
  images: ProductImage[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center text-muted-foreground">
        No images available
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <Dialog>
        <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden group">
          <Image
            src={images[selectedIndex].url || "/placeholder.svg"}
            alt={images[selectedIndex].alt_text || title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Zoom button */}
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn className="w-4 h-4" />
              <span className="sr-only">Zoom image</span>
            </Button>
          </DialogTrigger>

          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={goToNext}
              >
                <ChevronRight className="w-5 h-5" />
                <span className="sr-only">Next image</span>
              </Button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        <DialogContent className="max-w-4xl">
          <div className="relative aspect-square">
            <Image
              src={images[selectedIndex].url || "/placeholder.svg"}
              alt={images[selectedIndex].alt_text || title}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                selectedIndex === index ? "border-foreground" : "border-transparent hover:border-muted-foreground/50",
              )}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt_text || `${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
