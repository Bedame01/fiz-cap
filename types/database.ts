export interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string | null
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id: string | null
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded"
  total_amount: number
  currency: string
  shipping_address: Address | null
  billing_address: Address | null
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
}

export interface OrderItem {
  id: string
  name: string
  variant?: string
  price: number
  quantity: number
  image?: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: "new" | "read" | "replied"
  created_at: string
}

export interface StoreLocation {
  id: string
  name: string
  address: string
  city: string
  state: string | null
  country: string
  postal_code: string | null
  latitude: number
  longitude: number
  phone: string | null
  hours: Record<string, string> | null
  created_at: string
}
