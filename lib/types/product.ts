// Product types that work with Supabase database
export interface ProductImage {
  id: string
  url: string
  alt_text: string | null
  position: number
}

export interface ProductVariant {
  id: string
  size: string | null
  color: string | null
  sku: string | null
  price_adjustment: number
  inventory_quantity: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_at_price: number | null
  sku: string | null
  inventory_quantity: number
  category_id: string | null
  category?: Category | null
  style: string | null
  material: string | null
  brand: string
  color: string | null
  featured: boolean
  status: string
  tags: string[] | null
  images?: ProductImage[]
  variants?: ProductVariant[]
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  product: Product
  variant?: ProductVariant | null
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export function formatPrice(amount: number, currency = "NGN"): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount)
}
