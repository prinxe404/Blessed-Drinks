import { fetchOrders } from '@/lib/db'
import { OrdersManager } from '@/components/admin/OrdersManager'

export default async function AdminOrdersPage() {
  const orders = await fetchOrders()

  return <OrdersManager initialOrders={orders} />
}
