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
      {/* <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search-icon">
        <title id="search-icon">Search</title>
        <g clip-path="url(#clip0_738:3276)">
        <path d="M10.9549 22.1488C8.78808 22.1488 6.66987 21.4992 4.86818 20.2823C3.0665 19.0655 1.66229 17.3359 0.833066 15.3123C0.00384227 13.2886 -0.213135 11.0619 0.2096 8.91363C0.632334 6.76537 1.67583 4.79205 3.20804 3.24324C4.74025 1.69443 6.69241 0.639624 8.81764 0.212308C10.9429 -0.215008 13.1457 0.00432107 15.1477 0.842531C17.1496 1.68074 18.8606 3.10017 20.0645 4.92137C21.2683 6.74258 21.9109 8.88375 21.9109 11.0741C21.9077 14.0103 20.7524 16.8253 18.6984 18.9015C16.6445 20.9777 13.8596 22.1455 10.9549 22.1488ZM10.9549 1.12122C9.00736 1.12122 7.10359 1.70502 5.48422 2.79877C3.86486 3.89252 2.60272 5.44703 1.85741 7.26586C1.1121 9.0847 0.917027 11.0861 1.29698 13.0169C1.67694 14.9478 2.61482 16.7215 3.99197 18.1136C5.36912 19.5056 7.12379 20.4537 9.03395 20.8378C10.9441 21.2218 12.924 21.0247 14.7234 20.2713C16.5227 19.5179 18.0606 18.2421 19.1426 16.6051C20.2246 14.9682 20.8022 13.0438 20.8022 11.0751C20.7992 8.43612 19.7608 5.90601 17.9147 4.03994C16.0687 2.17387 13.5657 1.12422 10.9549 1.12122Z" fill="#9A94E0"></path>
        <path d="M23.4453 23.9999C23.3725 24 23.3005 23.9857 23.2332 23.9576C23.1659 23.9295 23.1048 23.8883 23.0533 23.8363L18.0011 18.7293C17.9036 18.6229 17.8507 18.4825 17.8535 18.3376C17.8563 18.1926 17.9145 18.0544 18.0159 17.9519C18.1173 17.8494 18.2541 17.7905 18.3975 17.7877C18.5409 17.7849 18.6798 17.8383 18.7851 17.9367L23.8374 23.0438C23.915 23.1221 23.9678 23.2219 23.9893 23.3306C24.0107 23.4393 23.9997 23.552 23.9577 23.6543C23.9158 23.7567 23.8446 23.8443 23.7534 23.9058C23.6622 23.9673 23.5549 24 23.4453 23.9999Z" fill="#9A94E0"></path>
        <path d="M17.6567 11.6608C17.5838 11.6609 17.5116 11.6466 17.4443 11.6184C17.3769 11.5903 17.3157 11.549 17.2642 11.4969C17.2126 11.4448 17.1717 11.3829 17.1439 11.3148C17.1161 11.2467 17.1018 11.1736 17.1019 11.0999C17.0999 9.4702 16.4586 7.90787 15.3185 6.75547C14.1785 5.60306 12.6328 4.95466 11.0205 4.95265C10.9458 4.95576 10.8713 4.94363 10.8013 4.91687C10.7314 4.8901 10.6675 4.84937 10.6136 4.79703C10.5596 4.74469 10.5167 4.68185 10.4874 4.61232C10.458 4.54278 10.4429 4.46798 10.4429 4.39239C10.4429 4.31681 10.458 4.242 10.4874 4.17247C10.5167 4.10293 10.5596 4.04009 10.6136 3.98775C10.6675 3.93541 10.7314 3.89468 10.8013 3.86792C10.8713 3.84116 10.9458 3.82891 11.0205 3.83201C12.9271 3.83402 14.755 4.60052 16.1031 5.96327C17.4513 7.32603 18.2096 9.17376 18.2115 11.101C18.2115 11.1746 18.1972 11.2474 18.1693 11.3154C18.1414 11.3834 18.1005 11.4452 18.049 11.4972C17.9975 11.5492 17.9363 11.5905 17.869 11.6185C17.8017 11.6466 17.7295 11.6609 17.6567 11.6608Z" fill="#9A94E0"></path>
        </g>
        <defs>
        <clipPath id="clip0_738:3276">
        <rect width="24" height="24" fill="white"></rect>
        </clipPath>
        </defs>
      </svg> */}
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
