/* ── Shared TypeScript types for Temple Seva ── */

export type Temple = {
  id: string
  name: string
  location: string
  image: string
  description: string
}

export type SevaCategory = 'pooja' | 'homam' | 'archana' | 'special'

export type Seva = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  longDescription?: string
  requiresDevotee: boolean
  category: SevaCategory
  rating: number
  reviewCount: number
  popular: boolean
  duration: string
  benefits?: string[]
}

export type User = {
  name: string
  email: string
  password: string
  phone?: string
  firstName?: string
  lastName?: string
  birthday?: string
  gender?: string
}

export type Devotee = {
  id?: string
  name: string
  nakshatra: string
  rashi: string
  gotram?: string
  relationship?: string
}

export type Address = {
  id: string
  label: string
  name: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export type CartItem = {
  id: string
  seva: Seva
  quantity: number
  devotee?: Devotee
  savedForLater?: boolean
}

export type Review = {
  id: string
  sevaId: string
  userName: string
  rating: number
  comment: string
  date: string
}

export type Coupon = {
  code: string
  discount: number
  type: 'percent' | 'flat'
  minAmount: number
  description: string
}

export type OrderTimelineEvent = {
  label: string
  time: string
  description: string
  completed: boolean
}

export type OrderStatus = 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'

export type Order = {
  id: string
  temple: Temple
  date: string
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  status: OrderStatus
  createdAt: string
  timeline: OrderTimelineEvent[]
  address?: Address
  paymentMethod?: string
  couponCode?: string
}

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
}
