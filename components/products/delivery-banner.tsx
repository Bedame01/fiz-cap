"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

function getNextCutoff(): Date {
  const now = new Date()
  const cutoff = new Date(now)
  cutoff.setHours(14, 0, 0, 0)
  if (now >= cutoff) {
    cutoff.setDate(cutoff.getDate() + 1)
  }
  return cutoff
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":")
}

interface DeliveryBannerProps {
  estimatedDays?: string
}

export function DeliveryBanner({ estimatedDays = "3-5 business days" }: DeliveryBannerProps) {
  const [countdown, setCountdown] = useState("")

  useEffect(() => {
    const update = () => {
      const cutoff = getNextCutoff()
      setCountdown(formatCountdown(cutoff.getTime() - Date.now()))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm">
      <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
      <p className="text-muted-foreground">
        Order in{" "}
        <span className="font-medium tabular-nums text-foreground">{countdown}</span> for delivery in{" "}
        <span className="font-medium text-foreground">{estimatedDays}</span>
      </p>
    </div>
  )
}
