"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface StoreSettings {
  id: string
  store_name: string
  store_email: string
  store_description: string
  free_shipping_threshold: number
  flat_shipping_rate: number
  international_shipping: boolean
  notify_new_orders: boolean
  notify_low_stock: boolean
  notify_contact_form: boolean
  low_stock_threshold: number
}

export default function AdminSettingsPage() {
  const supabase = createClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<string | null>(null)

  const [settings, setSettings] = useState<StoreSettings>({
    id: "",
    store_name: "CAPHAUS",
    store_email: "hello@caphaus.com",
    store_description: "Premium caps, snapbacks, and headwear for every style.",
    free_shipping_threshold: 75,
    flat_shipping_rate: 5.99,
    international_shipping: false,
    notify_new_orders: true,
    notify_low_stock: true,
    notify_contact_form: true,
    low_stock_threshold: 10,
  })

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from("store_settings").select("*").limit(1).single()

      if (data && !error) {
        setSettings(data)
      }
      setIsLoading(false)
    }
    fetchSettings()
  }, [supabase])

  const saveSettings = async (section: string) => {
    setIsSaving(section)

    const { error } = await supabase.from("store_settings").upsert({
      id: settings.id || undefined,
      store_name: settings.store_name,
      store_email: settings.store_email,
      store_description: settings.store_description,
      free_shipping_threshold: settings.free_shipping_threshold,
      flat_shipping_rate: settings.flat_shipping_rate,
      international_shipping: settings.international_shipping,
      notify_new_orders: settings.notify_new_orders,
      notify_low_stock: settings.notify_low_stock,
      notify_contact_form: settings.notify_contact_form,
      low_stock_threshold: settings.low_stock_threshold,
      updated_at: new Date().toISOString(),
    })

    setIsSaving(null)

    if (error) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Settings saved",
        description: `${section} settings have been updated successfully.`,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic details about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={settings.store_name}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Contact Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.store_email}
                  onChange={(e) => setSettings({ ...settings, store_email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.store_description}
                onChange={(e) => setSettings({ ...settings, store_description: e.target.value })}
                rows={3}
              />
            </div>
            <Button onClick={() => saveSettings("Store")} disabled={isSaving === "Store"}>
              {isSaving === "Store" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
            <CardDescription>Configure shipping rates and options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  value={settings.free_shipping_threshold}
                  onChange={(e) => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flatShippingRate">Flat Shipping Rate ($)</Label>
                <Input
                  id="flatShippingRate"
                  type="number"
                  step="0.01"
                  value={settings.flat_shipping_rate}
                  onChange={(e) => setSettings({ ...settings, flat_shipping_rate: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable International Shipping</Label>
                <p className="text-sm text-muted-foreground">Allow orders from outside the US</p>
              </div>
              <Switch
                checked={settings.international_shipping}
                onCheckedChange={(checked) => setSettings({ ...settings, international_shipping: checked })}
              />
            </div>
            <Button onClick={() => saveSettings("Shipping")} disabled={isSaving === "Shipping"}>
              {isSaving === "Shipping" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Email notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Order Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email when a new order is placed</p>
              </div>
              <Switch
                checked={settings.notify_new_orders}
                onCheckedChange={(checked) => setSettings({ ...settings, notify_new_orders: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when product stock is low (below {settings.low_stock_threshold} items)
                </p>
              </div>
              <Switch
                checked={settings.notify_low_stock}
                onCheckedChange={(checked) => setSettings({ ...settings, notify_low_stock: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                className="w-32"
                value={settings.low_stock_threshold}
                onChange={(e) => setSettings({ ...settings, low_stock_threshold: Number(e.target.value) })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Contact Form Submissions</Label>
                <p className="text-sm text-muted-foreground">Receive email for new contact messages</p>
              </div>
              <Switch
                checked={settings.notify_contact_form}
                onCheckedChange={(checked) => setSettings({ ...settings, notify_contact_form: checked })}
              />
            </div>
            <Button onClick={() => saveSettings("Notification")} disabled={isSaving === "Notification"}>
              {isSaving === "Notification" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
