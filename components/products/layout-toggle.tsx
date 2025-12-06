"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Columns2, Columns3, Columns4 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LayoutToggleProps {
  layout: "grid" | "list"
  columns: 2 | 3 | 4
  onLayoutChange: (layout: "grid" | "list") => void
  onColumnsChange: (columns: 2 | 3 | 4) => void
}

export function LayoutToggle({ layout, columns, onLayoutChange, onColumnsChange }: LayoutToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex border rounded-md">
        <Button
          variant="ghost"
          size="sm"
          className={cn("rounded-r-none", layout === "grid" && "bg-muted")}
          onClick={() => onLayoutChange("grid")}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="sr-only">Grid view</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("rounded-l-none", layout === "list" && "bg-muted")}
          onClick={() => onLayoutChange("list")}
        >
          <List className="w-4 h-4" />
          <span className="sr-only">List view</span>
        </Button>
      </div>

      {layout === "grid" && (
        <div className="hidden sm:flex border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            className={cn("rounded-r-none px-2", columns === 2 && "bg-muted")}
            onClick={() => onColumnsChange(2)}
          >
            <Columns2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn("rounded-none px-2", columns === 3 && "bg-muted")}
            onClick={() => onColumnsChange(3)}
          >
            <Columns3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn("rounded-l-none px-2", columns === 4 && "bg-muted")}
            onClick={() => onColumnsChange(4)}
          >
            <Columns4 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
