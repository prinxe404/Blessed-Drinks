import { NextRequest, NextResponse } from 'next/server'
import {
  fetchProducts,
  saveProduct,
  deleteProduct,
  fetchOrders,
  updateOrderStatus,
  fetchSettings,
  updateSettings,
} from '@/lib/db'
import { ProductMutationSchema, OrderStatusUpdateSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'overview'

  try {
    const products = await fetchProducts()
    const orders = await fetchOrders()
    const settings = await fetchSettings()

    if (type === 'drinks') {
      return NextResponse.json({ success: true, data: products })
    }

    if (type === 'orders') {
      return NextResponse.json({ success: true, data: orders })
    }

    if (type === 'settings') {
      return NextResponse.json({ success: true, data: settings })
    }

    // Overview Stats
    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === 'pending').length
    const completedOrders = orders.filter((o) => o.status === 'completed').length
    const totalRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalRevenue,
        },
        recentOrders: orders.slice(0, 5),
        productsSummary: {
          totalFormulations: products.length,
          activeInCellar: products.filter((p) => p.availability === 'available').length,
          depleted: products.filter((p) => p.availability === 'out_of_stock').length,
        },
        settings,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Admin error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const action = body.action

    if (action === 'save_drink') {
      const parsed = ProductMutationSchema.safeParse(body.drink)
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, errors: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      const saved = await saveProduct({ ...parsed.data, id: body.drink.id })
      return NextResponse.json({ success: true, data: saved })
    }

    if (action === 'delete_drink') {
      if (!body.id) {
        return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 })
      }
      await deleteProduct(body.id)
      return NextResponse.json({ success: true })
    }

    if (action === 'update_order_status') {
      const parsed = OrderStatusUpdateSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, errors: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
      const ok = await updateOrderStatus(parsed.data.orderId, parsed.data.status)
      return NextResponse.json({ success: ok })
    }

    if (action === 'update_settings') {
      const updated = await updateSettings(body.settings)
      return NextResponse.json({ success: true, data: updated })
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
