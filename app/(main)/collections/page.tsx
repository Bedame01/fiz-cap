import Link from "next/link"
import Image from "next/image"
import { getCollections } from "@/lib/shopify"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse our curated collections",
}

export default async function CollectionsPage() {
  const collections = await getCollections(20)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Collections</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our carefully curated collections, each designed with a unique aesthetic and purpose.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/shop?collection=${collection.handle}`}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary"
          >
            {collection.image ? (
              <Image
                src={collection.image.url || "/placeholder.svg"}
                alt={collection.image.altText || collection.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-semibold text-white mb-1">{collection.title}</h3>
              {collection.description && <p className="text-sm text-white/80 line-clamp-2">{collection.description}</p>}
            </div>
          </Link>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No collections found</p>
        </div>
      )}
    </div>
  )
}
