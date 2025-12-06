"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(searchParams.get("q") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query.trim()) {
        params.set("q", query.trim())
      } else {
        params.delete("q")
      }
      router.push(`/shop?${params.toString()}`)
    })
  }

  const clearSearch = () => {
    setQuery("")
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("q")
      router.push(`/shop?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10"
        disabled={isPending}
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={clearSearch}
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </form>
  )
}
