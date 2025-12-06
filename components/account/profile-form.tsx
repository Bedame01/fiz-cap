"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"

interface ProfileFormProps {
  initialData: {
    email: string
    firstName: string
    lastName: string
    phone: string
    userId: string
  }
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(initialData.firstName)
  const [lastName, setLastName] = useState(initialData.lastName)
  const [phone, setPhone] = useState(initialData.phone)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setIsSaved(false)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: initialData.userId,
        email: initialData.email,
        first_name: firstName,
        last_name: lastName,
        phone,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={initialData.email} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">Contact support to change your email address</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
        {isSaved && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Saved
          </span>
        )}
      </div>
    </form>
  )
}
