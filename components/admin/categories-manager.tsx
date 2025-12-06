"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, FolderTree, Upload, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
}

interface CategoriesManagerProps {
  categories: Category[]
}

export function CategoriesManager({ categories: initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isOpen, setIsOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
  })

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", image_url: "" })
    setEditingCategory(null)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url || "",
    })
    setIsOpen(true)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image_url: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const slug = formData.slug || generateSlug(formData.name)

    const categoryData = {
      name: formData.name,
      slug,
      description: formData.description || null,
      image_url: formData.image_url || null,
    }

    if (editingCategory) {
      const { data, error } = await supabase
        .from("categories")
        .update(categoryData)
        .eq("id", editingCategory.id)
        .select()
        .single()

      setIsLoading(false)

      if (error) {
        console.log("[v0] Category update error:", error)
        toast({
          title: "Error updating category",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      // Update local state
      setCategories((prev) => prev.map((cat) => (cat.id === editingCategory.id ? data : cat)))

      toast({
        title: "Category updated",
        description: `${formData.name} has been updated successfully.`,
      })
    } else {
      const { data, error } = await supabase.from("categories").insert(categoryData).select().single()

      setIsLoading(false)

      if (error) {
        console.log("[v0] Category insert error:", error)
        toast({
          title: "Error creating category",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      // Update local state
      setCategories((prev) => [...prev, data])

      toast({
        title: "Category created",
        description: `${formData.name} has been added successfully.`,
      })
    }

    setIsOpen(false)
    resetForm()
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsLoading(true)
    const { error } = await supabase.from("categories").delete().eq("id", deleteId)
    setIsLoading(false)

    if (error) {
      console.log("[v0] Category delete error:", error)
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      })
      setDeleteId(null)
      return
    }

    setCategories((prev) => prev.filter((cat) => cat.id !== deleteId))
    setDeleteId(null)

    toast({
      title: "Category deleted",
      description: "The category has been removed.",
    })
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: editingCategory ? prev.slug : generateSlug(e.target.value),
                    }))
                  }
                  placeholder="Snapbacks"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="snapbacks"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Category description..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Category Image</Label>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

                {formData.image_url ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                    <Image
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Category preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                      className="absolute top-2 right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !formData.name.trim()}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingCategory ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderTree className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-1">No categories yet</h3>
            <p className="text-muted-foreground mb-4">Create your first category to organize your products</p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                {category.image_url ? (
                  <Image
                    src={category.image_url || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FolderTree className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {category.description || "No description"}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                    onClick={() => setDeleteId(category.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Products in this category will become uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default CategoriesManager
