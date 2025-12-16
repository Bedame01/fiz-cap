import { createClient } from "@/lib/supabase/client"

export interface ShippingZone {
  id: string
  zone_name: string
  states: string[]
  base_rate: number
  per_kg_rate: number
  estimated_days: string
}

export interface ShippingCalculation {
  cost: number
  zone_name: string
  estimated_days: string
  is_free: boolean
}

// Average weight per cap item (in kg)
const AVERAGE_CAP_WEIGHT = 0.2

/**
 * Calculate shipping cost based on customer's state and cart details
 * @param state - Customer's state
 * @param subtotal - Cart subtotal
 * @param itemCount - Number of items in cart
 * @returns Shipping calculation with cost, zone, and delivery estimate
 */
export async function calculateShipping(
  state: string,
  subtotal: number,
  itemCount: number,
): Promise<ShippingCalculation> {
  try {
    const supabase = createClient()

    // Get free shipping threshold from store settings
    const { data: settings } = await supabase.from("store_settings").select("free_shipping_threshold").single()

    const freeShippingThreshold = settings?.free_shipping_threshold || 50000

    // Check if order qualifies for free shipping
    if (subtotal >= freeShippingThreshold) {
      return {
        cost: 0,
        zone_name: "Free Shipping",
        estimated_days: "3-5 business days",
        is_free: true,
      }
    }

    // Find shipping zone for the customer's state
    const { data: zones, error } = await supabase.from("shipping_zones").select("*").contains("states", [state.trim()])

    if (error || !zones || zones.length === 0) {
      // Fallback to default rate if state not found
      console.error("[v0] Shipping zone not found for state:", state)
      return {
        cost: 2500,
        zone_name: "Standard Shipping",
        estimated_days: "3-5 business days",
        is_free: false,
      }
    }

    const zone = zones[0] as ShippingZone

    // Calculate shipping: base rate + (weight-based rate * estimated total weight)
    const estimatedWeight = itemCount * AVERAGE_CAP_WEIGHT
    const shippingCost = zone.base_rate + zone.per_kg_rate * estimatedWeight

    return {
      cost: Math.round(shippingCost),
      zone_name: zone.zone_name,
      estimated_days: zone.estimated_days,
      is_free: false,
    }
  } catch (error) {
    console.error("[v0] Error calculating shipping:", error)
    // Return default shipping cost on error
    return {
      cost: 2500,
      zone_name: "Standard Shipping",
      estimated_days: "3-5 business days",
      is_free: false,
    }
  }
}

/**
 * Get all available Nigerian states from shipping zones
 */
export async function getAvailableStates(): Promise<string[]> {
  try {
    const supabase = createClient()
    const { data: zones } = await supabase.from("shipping_zones").select("states")

    if (!zones) return []

    // Flatten all states from all zones and remove duplicates
    const allStates = zones.flatMap((zone) => zone.states || [])
    return [...new Set(allStates)].sort()
  } catch (error) {
    console.error("[v0] Error fetching states:", error)
    return []
  }
}
