"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, Plus, User, ShoppingBag, Camera, RefreshCw } from "lucide-react"
import Image from "next/image"

interface AIImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void
  defaultStyle?: string
  defaultColor?: string
  defaultMaterial?: string
}

const styles = ["snapback", "fitted", "dad-hat", "trucker", "beanie", "bucket", "visor"]
const colors = ["Black", "White", "Navy", "Gray", "Red", "Green", "Brown", "Beige", "Camo", "Denim", "Pink", "Yellow"]
const materials = ["Cotton", "Polyester", "Wool", "Acrylic", "Nylon", "Leather", "Denim", "Corduroy", "Canvas", "Suede"]

type DisplayMode = "product" | "model" | "lifestyle"
type ModelType = "male" | "female" | "neutral"

export function AIImageGenerator({
  onImageGenerated,
  defaultStyle,
  defaultColor,
  defaultMaterial,
}: AIImageGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [style, setStyle] = useState(defaultStyle || "")
  const [color, setColor] = useState(defaultColor || "")
  const [material, setMaterial] = useState(defaultMaterial || "")
  const [customPrompt, setCustomPrompt] = useState("")

  const [displayMode, setDisplayMode] = useState<DisplayMode>("product")
  const [modelType, setModelType] = useState<ModelType>("neutral")

  const handleGenerate = async (generateMultiple = false) => {
    setIsGenerating(true)
    setGeneratedImages([])
    setSelectedImage(null)
    setMessage(null)

    try {
      const count = generateMultiple ? 4 : 1
      const newImages: string[] = []

      for (let i = 0; i < count; i++) {
        const response = await fetch("/api/generate-cap-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: customPrompt,
            style,
            color,
            material,
            displayMode,
            modelType: displayMode === "model" ? modelType : undefined,
          }),
        })

        const data = await response.json()

        if (data.success && data.imageUrl) {
          newImages.push(data.imageUrl)
        }

        if (data.message && i === 0) {
          setMessage(data.message)
        }
      }

      setGeneratedImages(newImages)
      if (newImages.length === 1) {
        setSelectedImage(newImages[0])
      }
    } catch (error) {
      console.error("Generation error:", error)
      setMessage("Failed to generate image. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseImage = () => {
    if (selectedImage) {
      onImageGenerated(selectedImage)
      setIsOpen(false)
      setGeneratedImages([])
      setSelectedImage(null)
    }
  }

  const handleUseAll = () => {
    generatedImages.forEach((img) => {
      onImageGenerated(img)
    })
    setIsOpen(false)
    setGeneratedImages([])
    setSelectedImage(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="gap-2 bg-transparent">
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Product Image Generator
          </DialogTitle>
          <DialogDescription>
            Generate professional product images using AI - completely free, no API key required
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="settings" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview" disabled={generatedImages.length === 0}>
              Preview ({generatedImages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6 mt-4">
            {/* Display Mode Selection */}
            <div className="space-y-3">
              <Label>Display Mode</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant={displayMode === "product" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setDisplayMode("product")}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span className="text-xs">Product Shot</span>
                </Button>
                <Button
                  type="button"
                  variant={displayMode === "model" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setDisplayMode("model")}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">Model Wearing</span>
                </Button>
                <Button
                  type="button"
                  variant={displayMode === "lifestyle" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setDisplayMode("lifestyle")}
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-xs">Lifestyle</span>
                </Button>
              </div>
            </div>

            {/* Model Type - only shown when model display mode is selected */}
            {displayMode === "model" && (
              <div className="space-y-3">
                <Label>Model Type</Label>
                <div className="flex gap-2">
                  {(["male", "female", "neutral"] as ModelType[]).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={modelType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setModelType(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Cap Details */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Material</Label>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="space-y-2">
              <Label>Additional Details (optional)</Label>
              <Input
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., embroidered logo, vintage wash, neon lighting, outdoor background..."
              />
              <p className="text-xs text-muted-foreground">Add extra details to customize the generated image</p>
            </div>

            {/* Generate Buttons */}
            <div className="flex gap-3">
              <Button onClick={() => handleGenerate(false)} disabled={isGenerating} className="flex-1">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate 1 Image
                  </>
                )}
              </Button>
              <Button onClick={() => handleGenerate(true)} disabled={isGenerating} variant="secondary">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate 4 Variations
              </Button>
            </div>

            {message && <p className="text-sm text-muted-foreground text-center bg-muted p-2 rounded">{message}</p>}

            {/* Quick Preview */}
            {generatedImages.length > 0 && (
              <div className="space-y-3">
                <Label>Generated Images</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {generatedImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === img
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Generated cap ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={handleUseAll}>
                    Use All Images
                  </Button>
                  <Button type="button" size="sm" disabled={!selectedImage} onClick={handleUseImage}>
                    <Plus className="h-4 w-4 mr-1" />
                    Use Selected
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            {selectedImage && (
              <div className="space-y-4">
                <div className="relative aspect-square w-full max-w-lg mx-auto rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected generated image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleUseImage} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Use This Image
                  </Button>
                  <Button variant="outline" onClick={() => handleGenerate(false)} disabled={isGenerating}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            )}

            {generatedImages.length > 1 && (
              <div className="mt-6">
                <Label className="mb-3 block">All Variations</Label>
                <div className="grid grid-cols-4 gap-3">
                  {generatedImages.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === img ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Variation ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}