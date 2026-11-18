import { z } from 'zod'

export const CheckoutSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(8, 'Phone number must be at least 8 digits'),
  deliveryLocation: z.string().min(3, 'Delivery location is required (e.g. Osu, East Legon)'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  additionalInstructions: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive('Quantity must be at least 1'),
    })
  ).min(1, 'Cart cannot be empty'),
})

export type CheckoutInput = z.infer<typeof CheckoutSchema>

export const ProductMutationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  subtitle: z.string().optional(),
  price: z.number().positive(),
  volume: z.string().optional(),
  category: z.enum(['all', 'fermented', 'botanical', 'creamy']),
  shortDescription: z.string().min(5),
  imageUrl: z.string().url().or(z.string().min(1)),
  badgeText: z.string().optional(),
  availability: z.enum(['available', 'out_of_stock', 'reserve']),
  stockQuantity: z.number().int().nonnegative(),
  isFeatured: z.boolean().optional(),
  batchNumber: z.string().optional(),
})

export const OrderStatusUpdateSchema = z.object({
  orderId: z.string(),
  status: z.enum(['pending', 'confirmed', 'processing', 'completed', 'cancelled']),
})
