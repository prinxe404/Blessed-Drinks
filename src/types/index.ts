export interface ProductItem {
  id: string
  name: string
  slug: string
  subtitle: string
  price: number
  volume: string
  category: 'all' | 'fermented' | 'botanical' | 'creamy'
  shortDescription: string
  imageUrl: string
  badgeText?: string
  availability: 'available' | 'out_of_stock' | 'reserve'
  stockQuantity: number
  isFeatured?: boolean
  batchNumber?: string
}

export interface CartItem {
  product: ProductItem
  quantity: number
}

export interface CheckoutFormData {
  fullName: string
  phoneNumber: string
  deliveryLocation: string
  deliveryAddress: string
  additionalInstructions?: string
}

export interface OrderRecord {
  id: string
  orderId: string
  customerName: string
  phoneNumber: string
  deliveryLocation: string
  deliveryAddress: string
  additionalInstructions?: string
  items: {
    productId: string
    productName: string
    volume?: string
    unitPrice: number
    quantity: number
    subtotal: number
  }[]
  subtotal: number
  deliveryFee: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'
  createdAt: string
  whatsappUrl?: string
}

export interface BusinessSettings {
  businessName: string
  tagline: string
  whatsappNumber: string
  businessPhone: string
  businessEmail: string
  deliveryFee: number
  operatingHours: string
  deliveryCoverage: string
  storeStatus: 'open' | 'closed'
}
