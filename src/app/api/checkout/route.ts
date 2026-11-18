import { NextRequest, NextResponse } from 'next/server'
import { CheckoutSchema } from '@/lib/validations'
import { fetchProducts, createOrder, fetchSettings } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validationResult = CheckoutSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.flatten().fieldErrors,
          message: 'Invalid customer order information',
        },
        { status: 400 }
      )
    }

    const { fullName, phoneNumber, deliveryLocation, deliveryAddress, additionalInstructions, items } =
      validationResult.data

    // Retrieve database products to calculate verified prices
    const catalog = await fetchProducts()
    const settings = await fetchSettings()

    const orderItems: Array<{
      productId: string
      productName: string
      volume?: string
      unitPrice: number
      quantity: number
      subtotal: number
    }> = []

    let calculatedSubtotal = 0

    for (const item of items) {
      const product = catalog.find((p) => p.id === item.productId || p.slug === item.productId)
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product ${item.productId} was not found in our catalog.` },
          { status: 400 }
        )
      }

      if (product.availability === 'out_of_stock' || product.stockQuantity < 1) {
        return NextResponse.json(
          { success: false, message: `${product.name} is currently out of stock.` },
          { status: 400 }
        )
      }

      const lineTotal = product.price * item.quantity
      calculatedSubtotal += lineTotal

      orderItems.push({
        productId: product.id,
        productName: product.name,
        volume: product.volume,
        unitPrice: product.price,
        quantity: item.quantity,
        subtotal: lineTotal,
      })
    }

    const deliveryFee = settings.deliveryFee ?? 20.0
    const calculatedTotal = calculatedSubtotal + deliveryFee

    // Generate unique formatted order reference
    const orderRef = `#BD-${Math.floor(1000 + Math.random() * 9000)}`

    // Compose formatted WhatsApp Click-to-Chat prefilled message
    let itemsSummary = ''
    orderItems.forEach((it) => {
      itemsSummary += `  - ${it.quantity}x ${it.productName} (${it.volume || 'bottle'}) @ GH₵ ${it.unitPrice.toFixed(2)} = GH₵ ${it.subtotal.toFixed(2)}\n`
    })

    const whatsAppMessage =
      `Hello ${settings.businessName}! I would like to place an order:\n\n` +
      `*Order ID:* ${orderRef}\n` +
      `*Customer:* ${fullName}\n` +
      `*Phone:* ${phoneNumber}\n` +
      `*Delivery Location:* ${deliveryLocation}\n` +
      `*Address:* ${deliveryAddress}\n` +
      (additionalInstructions ? `*Instructions:* ${additionalInstructions}\n` : '') +
      `\n*Ordered Drinks:*\n` +
      itemsSummary +
      `\n*Subtotal:* GH₵ ${calculatedSubtotal.toFixed(2)}\n` +
      `*Delivery Fee:* GH₵ ${deliveryFee.toFixed(2)}\n` +
      `*Total Amount:* GH₵ ${calculatedTotal.toFixed(2)}\n\n` +
      `Please confirm order preparation and rider dispatch.`

    const encodedMessage = encodeURIComponent(whatsAppMessage)
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`

    // Persist to database
    const savedOrder = await createOrder({
      orderId: orderRef,
      customerName: fullName,
      phoneNumber,
      deliveryLocation,
      deliveryAddress,
      additionalInstructions: additionalInstructions || '',
      items: orderItems,
      subtotal: calculatedSubtotal,
      deliveryFee,
      totalAmount: calculatedTotal,
      status: 'pending',
      whatsappUrl,
    })

    return NextResponse.json({
      success: true,
      message: 'Order created successfully in pending status',
      order: savedOrder,
      whatsappUrl,
    })
  } catch (error: any) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error creating checkout order' },
      { status: 500 }
    )
  }
}
