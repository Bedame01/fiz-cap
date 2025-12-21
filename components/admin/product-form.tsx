"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "./image-upload"
import { AIImageGenerator } from "./ai-image-generator"
import { Sparkles, Plus, X } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_at_price: number | null
  category_id: string | null
  inventory_quantity: number
  status: string
  featured: boolean
  style: string | null
  material: string | null
  color: string | null
  brand: string | null
  tags: string[] | null
  product_images?: { id: string; url: string; position: number }[]
  variants?: ProductVariant[]
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

interface ProductVariant {
  id?: string
  size: string
  color: string
  sku: string
  price_adjustment: number
  inventory_quantity: number
}

const defaultStyles = ["snapback", "fitted", "dad-hat", "trucker", "beanie", "bucket", "visor"]
const defaultColors = ["Black", "White", "Navy", "Gray", "Red", "Green", "Brown", "Beige", "Blue", "Yellow", "Pink"]
const defaultMaterials = ["Cotton", "Polyester", "Wool", "Acrylic", "Nylon", "Leather", "Denim"]
const defaultSizes = ["7", "7⅛", "7¼", "7⅜", "7½", "7⅝", "7¾", "8"]

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    short_description: product?.short_description || "",
    price: product?.price?.toString() || "",
    compare_at_price: product?.compare_at_price?.toString() || "",
    category_id: product?.category_id || "",
    inventory_quantity: product?.inventory_quantity?.toString() || "0",
    status: product?.status || "active",
    featured: product?.featured || false,
    style: product?.style || "",
    material: product?.material || "",
    color: product?.color || "",
  })

  const [images, setImages] = useState<{ url: string; isNew?: boolean }[]>(
    product?.product_images?.map((img) => ({ url: img.url })) || [],
  )

  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants?.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color || "",
      sku: v.sku || "",
      price_adjustment: v.price_adjustment || 0,
      inventory_quantity: v.inventory_quantity || 0,
    })) || [],
  )

  const [newVariant, setNewVariant] = useState<ProductVariant>({
    size: "",
    color: "",
    sku: "",
    price_adjustment: 0,
    inventory_quantity: 0,
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: product ? prev.slug : generateSlug(name),
    }))
  }

  const handleAIImageGenerated = (imageUrl: string) => {
    if (!images.some((img) => img.url === imageUrl)) {
      setImages((prev) => [...prev, { url: imageUrl, isNew: true }])
      toast({
        title: "Image added",
        description: "AI-generated image has been added to the product.",
      })
    }
  }

  const handleAddVariant = () => {
    if (!newVariant.size) {
      toast({
        title: "Size required",
        description: "Please select a size for the variant",
        variant: "destructive",
      })
      return
    }

    setVariants([...variants, { ...newVariant }])
    setNewVariant({
      size: "",
      color: "",
      sku: "",
      price_adjustment: 0,
      inventory_quantity: 0,
    })

    toast({
      title: "Variant added",
      description: `${newVariant.size}${newVariant.color ? ` - ${newVariant.color}` : ""} has been added`,
    })
  }

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const productData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      short_description: formData.short_description || null,
      price: Number.parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? Number.parseFloat(formData.compare_at_price) : null,
      category_id: formData.category_id || null,
      inventory_quantity: Number.parseInt(formData.inventory_quantity),
      status: formData.status,
      featured: formData.featured,
      style: formData.style || null,
      material: formData.material || null,
      color: formData.color || null,
    }

    let productId = product?.id
    let error

    if (product) {
      const result = await supabase.from("products").update(productData).eq("id", product.id)
      error = result.error
    } else {
      const result = await supabase.from("products").insert(productData).select("id").single()
      error = result.error
      productId = result.data?.id
    }

    if (error) {
      setIsLoading(false)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    if (productId) {
      if (product) {
        await supabase.from("product_images").delete().eq("product_id", productId)
        await supabase.from("product_variants").delete().eq("product_id", productId)
      }

      if (images.length > 0) {
        const imageInserts = images.map((img, index) => ({
          product_id: productId,
          url: img.url,
          position: index,
          alt_text: formData.name,
        }))
        await supabase.from("product_images").insert(imageInserts)
      }

      if (variants.length > 0) {
        const variantInserts = variants.map((variant) => ({
          product_id: productId,
          size: variant.size,
          color: variant.color || null,
          sku: variant.sku || null,
          price_adjustment: variant.price_adjustment,
          inventory_quantity: variant.inventory_quantity,
        }))
        const { error: variantsError } = await supabase.from("product_variants").insert(variantInserts)

        if (variantsError) {
          console.error("[v0] Error inserting variants:", variantsError)
          toast({
            title: "Error saving variants",
            description: "Some variants may not have been saved properly",
            variant: "destructive",
          })
        } else {
          console.log("[v0] Successfully saved", variants.length, "variants")
        }
      }
    }

    setIsLoading(false)

    toast({
      title: product ? "Product updated" : "Product created",
      description: `${formData.name} has been ${product ? "updated" : "added"} successfully.`,
    })

    router.push("/admin/products")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Classic Snapback"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="classic-snapback"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Input
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
                  placeholder="Brief product summary..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your product in detail..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Images</span>
                <AIImageGenerator
                  onImageGenerated={handleAIImageGenerated}
                  defaultStyle={formData.style}
                  defaultColor={formData.color}
                  defaultMaterial={formData.material}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload images={images} onImagesChange={setImages} />
              <p className="text-xs text-muted-foreground mt-3">
                <Sparkles className="h-3 w-3 inline mr-1" />
                Tip: Use AI generation to create professional product photos with models wearing your caps
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Style</Label>
                <Select
                  value={formData.style}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, style: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultStyles.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1).replace("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {defaultColors.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant={formData.color === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, color: prev.color === color ? "" : color }))}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Material</Label>
                <div className="flex flex-wrap gap-2">
                  {defaultMaterials.map((material) => (
                    <Button
                      key={material}
                      type="button"
                      variant={formData.material === material ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, material: prev.material === material ? "" : material }))
                      }
                    >
                      {material}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Add size and color variants for this product. Each variant can have its own inventory and pricing.
              </p>

              {variants.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Variants</Label>
                  <div className="space-y-2">
                    {variants.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium">
                            {variant.size}
                            {variant.color && ` - ${variant.color}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Stock: {variant.inventory_quantity}
                            {variant.price_adjustment !== 0 && ` • Price adjustment: ₦${variant.price_adjustment}`}
                          </p>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveVariant(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 p-4 border rounded-lg">
                <Label>Add New Variant</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="variant-size">Size</Label>
                    <Select
                      value={newVariant.size}
                      onValueChange={(value) => setNewVariant({ ...newVariant, size: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variant-color">Color (Optional)</Label>
                    <Select
                      value={newVariant.color}
                      onValueChange={(value) => setNewVariant({ ...newVariant, color: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultColors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variant-inventory">Inventory</Label>
                    <Input
                      id="variant-inventory"
                      type="number"
                      min="0"
                      value={newVariant.inventory_quantity}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, inventory_quantity: Number.parseInt(e.target.value) || 0 })
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variant-price-adjustment">Price Adjustment (₦)</Label>
                    <Input
                      id="variant-price-adjustment"
                      type="number"
                      step="0.01"
                      value={newVariant.price_adjustment}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, price_adjustment: Number.parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0.00"
                    />
                    <p className="text-xs text-muted-foreground">
                      Additional cost for this variant (e.g., +500 for XL)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variant-sku">SKU (Optional)</Label>
                    <Input
                      id="variant-sku"
                      value={newVariant.sku}
                      onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                      placeholder="PROD-SIZE-COLOR"
                    />
                  </div>
                </div>

                <Button type="button" onClick={handleAddVariant} variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    className="pl-7"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="compare_at_price">Compare at Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                  <Input
                    id="compare_at_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.compare_at_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, compare_at_price: e.target.value }))}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Original price for showing discounts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inventory_quantity">Stock Quantity</Label>
                <Input
                  id="inventory_quantity"
                  type="number"
                  min="0"
                  value={formData.inventory_quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, inventory_quantity: e.target.value }))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Product Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured Product</Label>
                  <p className="text-xs text-muted-foreground">Show on homepage</p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
