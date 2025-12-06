"use client"

import type { StoreLocation } from "@/types/database"
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StoreListProps {
  stores: StoreLocation[]
}

export function StoreList({ stores }: StoreListProps) {
  if (stores.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No stores found</h3>
        <p className="text-muted-foreground">We are expanding soon. Check back later!</p>
      </div>
    )
  }

  const openInMaps = (store: StoreLocation) => {
    const query = encodeURIComponent(
      `${store.address}, ${store.city}, ${store.state || ""} ${store.postal_code || ""}, ${store.country}`,
    )
    window.open(`https://maps.google.com/maps?q=${query}`, "_blank")
  }

  return (
    <div className="space-y-4">
      {stores.map((store) => (
        <div key={store.id} className="bg-card rounded-lg border p-6 hover:border-foreground/20 transition-colors">
          <h3 className="text-lg font-semibold mb-3">{store.name}</h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p>{store.address}</p>
                <p className="text-muted-foreground">
                  {store.city}
                  {store.state && `, ${store.state}`} {store.postal_code}
                </p>
                <p className="text-muted-foreground">{store.country}</p>
              </div>
            </div>

            {store.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={`tel:${store.phone}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {store.phone}
                </a>
              </div>
            )}

            {store.hours && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground">
                  {Object.entries(store.hours).map(([day, time]) => (
                    <p key={day}>
                      <span className="capitalize">{day}:</span> {time}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button variant="outline" size="sm" className="mt-4 bg-transparent" onClick={() => openInMaps(store)}>
            Get Directions
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </div>
      ))}
    </div>
  )
}
