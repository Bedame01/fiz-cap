export type ProductStyle = "snapback" | "fitted" | "dad-hat" | "trucker" | "beanie" | "bucket" | "visor" | "flat-bill"

export type ProductStatus = "draft" | "active" | "archived"
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"
export type UserRole = "customer" | "admin" | "super_admin"
export type ContactStatus = "new" | "read" | "replied" | "archived"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_at_price: number | null
  cost_per_item: number | null
  sku: string | null
  barcode: string | null
  track_inventory: boolean
  inventory_quantity: number
  category_id: string | null
  style: ProductStyle | null
  material: string | null
  brand: string | null
  color: string | null
  size: string | null
  featured: boolean
  status: ProductStatus
  tags: string[] | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Joined data
  category?: Category
  images?: ProductImage[]
  variants?: ProductVariant[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  position: number
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string | null
  price: number | null
  compare_at_price: number | null
  inventory_quantity: number
  options: Record<string, string>
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  email: string
  status: OrderStatus
  payment_status: PaymentStatus
  subtotal: number
  shipping_cost: number
  tax: number
  discount: number
  total: number
  currency: string
  shipping_address: Address | null
  billing_address: Address | null
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id: string | null
  notes: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // Joined data
  items?: OrderItem[]
  user?: Profile
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  name: string
  sku: string | null
  price: number
  quantity: number
  total: number
  image_url: string | null
  options: Record<string, string>
  created_at: string
}

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  phone?: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  status: ContactStatus
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
  phone: string | null
  email: string | null
  lat: number | null
  lng: number | null
  hours: Record<string, string> | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  status: "active" | "unsubscribed"
  created_at: string
}
