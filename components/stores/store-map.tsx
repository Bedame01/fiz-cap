"use client"

import { useEffect, useRef, useState } from "react"
import type { StoreLocation } from "@/types/database"
import { Loader2, MapPin } from "lucide-react"

interface StoreMapProps {
  stores: StoreLocation[]
  selectedStoreId?: string
  onSelectStore?: (storeId: string) => void
}

export function StoreMap({ stores, selectedStoreId, onSelectStore }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div ref={mapRef} className="relative w-full h-[400px] lg:h-[500px] bg-secondary">
        {!isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Static map visualization - no external API needed */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-secondary/60">
              {/* Grid pattern for visual effect */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, currentColor 1px, transparent 1px),
                    linear-gradient(to bottom, currentColor 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Map container with store markers */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full max-w-lg aspect-[4/3]">
                  {/* US Map outline (simplified) */}
                  <svg
                    viewBox="0 0 960 600"
                    className="w-full h-full text-border"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M234.4,515.2l-0.7-2.8l-2.8-2.1l-0.7-3.5l1.4-3.5l-1.4-2.8l2.8-1.4l0.7-2.8l2.1-0.7l0.7,2.1l2.8,0.7l0.7,2.1l2.8,2.1l-0.7,2.8l-2.1,2.1l-0.7,2.8l-2.1,2.8L234.4,515.2z" />
                    <ellipse cx="480" cy="300" rx="400" ry="250" strokeDasharray="4 4" />
                  </svg>

                  {/* Store location markers */}
                  {stores.map((store, index) => {
                    // Map coordinates to SVG viewBox
                    // Simple mercator-like projection for US coordinates
                    const normalizedLng = ((store.longitude + 130) / 65) * 100 // -130 to -65 longitude for US
                    const normalizedLat = ((50 - store.latitude) / 30) * 100 // 50 to 20 latitude for US

                    const x = Math.min(Math.max(normalizedLng, 5), 95)
                    const y = Math.min(Math.max(normalizedLat, 5), 95)

                    const isSelected = selectedStoreId === store.id

                    return (
                      <button
                        key={store.id}
                        onClick={() => onSelectStore?.(store.id)}
                        className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 group ${
                          isSelected ? "z-10 scale-125" : "hover:scale-110 hover:z-10"
                        }`}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                        }}
                        title={store.name}
                        aria-label={`View ${store.name}`}
                      >
                        <MapPin
                          className={`w-6 h-6 drop-shadow-md transition-colors ${
                            isSelected
                              ? "text-foreground fill-foreground"
                              : "text-foreground/70 group-hover:text-foreground"
                          }`}
                        />
                        {/* Tooltip on hover/select */}
                        <div
                          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-foreground text-background text-xs px-2 py-1 rounded shadow-lg transition-opacity ${
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {store.name}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
              <p className="text-sm font-medium mb-2">
                {stores.length} Location{stores.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>Click a marker to view details</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
