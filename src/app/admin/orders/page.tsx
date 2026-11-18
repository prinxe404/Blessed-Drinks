import { fetchOrders } from '@/lib/db'
import { OrdersManager } from '@/components/admin/OrdersManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminOrdersPage() {
  const orders = await fetchOrders()

  return <OrdersManager initialOrders={orders} />
}
