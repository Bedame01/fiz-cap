"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, ImagePlus, LinkIcon } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageUploadProps {
  images: { url: string; isNew?: boolean }[]
  onImagesChange: (images: { url: string; isNew?: boolean }[]) => void
  onAIGenerate?: () => void
  maxImages?: number
}

export function ImageUpload({ images, onImagesChange, onAIGenerate, maxImages = 10 }: ImageUploadProps) {
  const [urlInput, setUrlInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    const newImages: { url: string; isNew?: boolean }[] = []

    for (const file of Array.from(files)) {
      if (images.length + newImages.length >= maxImages) break

      const reader = new FileReader()
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      newImages.push({ url: dataUrl, isNew: true })
    }

    onImagesChange([...images, ...newImages])
    setIsUploading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUrlAdd = () => {
    if (!urlInput.trim() || images.length >= maxImages) return
    if (!images.some((img) => img.url === urlInput)) {
      onImagesChange([...images, { url: urlInput, isNew: true }])
      setUrlInput("")
    }
  }

  const handleRemove = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    const newImages: { url: string; isNew?: boolean }[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue
      if (images.length + newImages.length >= maxImages) break

      const reader = new FileReader()
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      newImages.push({ url: dataUrl, isNew: true })
    }

    onImagesChange([...images, ...newImages])
    setIsUploading(false)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="url">
            <LinkIcon className="h-4 w-4 mr-2" />
            Image URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">{isUploading ? "Uploading..." : "Click to upload or drag and drop"}</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-4">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlAdd())}
            />
            <Button type="button" onClick={handleUrlAdd} disabled={!urlInput.trim()}>
              Add
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {onAIGenerate && (
        <Button type="button" variant="outline" className="w-full bg-transparent" onClick={onAIGenerate}>
          <ImagePlus className="h-4 w-4 mr-2" />
          Generate with AI
        </Button>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {images.map((img, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
              <Image src={img.url || "/placeholder.svg"} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-2 left-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
          <ImagePlus className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No images added yet</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {images.length} of {maxImages} images added
      </p>
    </div>
  )
}

export default ImageUpload
