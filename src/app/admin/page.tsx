import Link from 'next/link'
import { fetchOrders, fetchProducts } from '@/lib/db'
import {
  Receipt,
  Clock,
  CheckCircle,
  Banknote,
  ArrowRight,
  MessageCircle,
  Wine,
  PackageOpen,
} from 'lucide-react'

// Ensure fresh dynamic server evaluation on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminOverviewPage() {
  const orders = await fetchOrders()
  const products = await fetchProducts()

  // Live Summary Stats from real database records
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const completedOrders = orders.filter((o) => o.status === 'completed').length
  
  // Real revenue calculated strictly from completed orders
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const recentOrders = orders.slice(0, 5)
  const activeProducts = products.filter((p) => p.availability === 'available').length

  return (
    <div className="max-w-[1360px] mx-auto w-full space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#404943] block">
            BLESSED OPERATIONS CONSOLE
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl text-[#003422] font-semibold tracking-tight">
            Analytics & Overview
          </h1>
          <p className="text-sm text-[#404943] max-w-xl">
            Live real-time ledger of orders placed by customers, fulfillment statuses, and verified revenue.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-[#ffcd70] text-[#785500] px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7c5800] animate-ping"></span>
            <span className="text-xs uppercase tracking-wider font-semibold">
              Live Storefront Connected
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Metric Cards (Google Stitch design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Orders */}
        <div className="bg-[#f6f3ea] p-6 flex flex-col justify-between h-44 border border-[#003422]/10 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs uppercase tracking-wider text-[#404943] font-semibold">
              Total Orders
            </span>
            <Receipt className="w-5 h-5 text-[#003422]" />
          </div>
          <div>
            <span className="font-headline text-4xl text-[#003422] font-bold block leading-none">
              {totalOrders}
            </span>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#404943]">
              <span>
                {totalOrders === 0 ? 'No customer orders yet' : `${totalOrders} orders recorded`}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-[#f6f3ea] p-6 flex flex-col justify-between h-44 border border-[#003422]/10 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs uppercase tracking-wider text-[#404943] font-semibold">
              Pending Orders
            </span>
            <Clock className="w-5 h-5 text-[#7c5800]" />
          </div>
          <div>
            <span className="font-headline text-4xl text-[#7c5800] font-bold block leading-none">
              {pendingOrders}
            </span>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#404943]">
              <span className="w-1.5 h-1.5 bg-[#7c5800] rounded-full"></span>
              <span>
                {pendingOrders === 0 ? 'All orders cleared' : 'Awaiting confirmation & dispatch'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Completed Orders */}
        <div className="bg-[#f6f3ea] p-6 flex flex-col justify-between h-44 border border-[#003422]/10 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs uppercase tracking-wider text-[#404943] font-semibold">
              Completed Orders
            </span>
            <CheckCircle className="w-5 h-5 text-[#003422]" />
          </div>
          <div>
            <span className="font-headline text-4xl text-[#003422] font-bold block leading-none">
              {completedOrders}
            </span>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#404943]">
              <span>
                {completedOrders === 0 ? 'No completed orders yet' : 'Successfully fulfilled'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="bg-[#f6f3ea] p-6 flex flex-col justify-between h-44 border border-[#003422]/10 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs uppercase tracking-wider text-[#404943] font-semibold">
              Total Revenue
            </span>
            <Banknote className="w-5 h-5 text-[#003422]" />
          </div>
          <div>
            <span className="font-headline text-3xl text-[#003422] font-bold block tracking-tight">
              GH₵ {totalRevenue.toFixed(2)}
            </span>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#404943]">
              <span>From completed orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Inventory Banner */}
      <div className="bg-[#f6f3ea] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#003422]/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#003422] text-[#ffcd70] flex items-center justify-center shrink-0">
            <Wine className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-headline text-lg text-[#1c1c17] font-semibold">
              Live Heritage Drink Formulations
            </h2>
            <p className="text-xs text-[#404943]">
              {products.length} catalog beverages managed across artisanal categories (Fermented, Botanical, Sweet).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase tracking-widest text-[#404943] block">
              Inventory In Stock
            </span>
            <span className="text-sm font-bold text-[#003422]">
              {activeProducts} Available Blends
            </span>
          </div>
          <Link
            href="/admin/drinks"
            className="bg-[#003422] text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#174c36] transition-colors"
          >
            Manage Drinks
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-[#003422]/10 shadow-sm">
        {/* Header */}
        <div className="p-6 flex items-center justify-between bg-[#f1eee5] border-b border-[#003422]/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#003422]"></span>
            <h2 className="font-headline text-xl text-[#1c1c17] font-semibold">Recent Orders</h2>
          </div>
          <Link
            href="/admin/orders"
            className="group flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#003422] hover:text-[#7c5800] transition-colors font-bold"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Orders Table or Empty State */}
        {recentOrders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <PackageOpen className="w-12 h-12 text-[#404943]/40 mb-3" />
            <h3 className="font-headline text-lg text-[#003422] font-semibold">No Customer Orders Yet</h3>
            <p className="text-xs text-[#404943] max-w-sm mt-1 mb-4">
              When customers select drinks on the website and proceed to WhatsApp checkout, new orders will immediately appear here.
            </p>
            <Link
              href="/"
              target="_blank"
              className="text-xs uppercase font-semibold tracking-wider text-[#7c5800] hover:text-[#003422] transition-colors"
            >
              Preview Live Storefront ↗
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#ebe8df] text-[#404943] text-xs uppercase tracking-wider border-b border-[#003422]/10">
                  <th className="py-3.5 px-6 font-semibold">Order ID</th>
                  <th className="py-3.5 px-6 font-semibold">Customer</th>
                  <th className="py-3.5 px-6 font-semibold">Amount</th>
                  <th className="py-3.5 px-6 font-semibold">Timestamp</th>
                  <th className="py-3.5 px-6 font-semibold">Status</th>
                  <th className="py-3.5 px-6 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#1c1c17] divide-y divide-[#003422]/5">
                {recentOrders.map((order) => {
                  let statusBadge = (
                    <span className="inline-flex items-center px-2.5 py-0.5 bg-[#ffcd70] text-[#785500] text-xs uppercase tracking-wider font-bold">
                      Pending
                    </span>
                  )

                  if (order.status === 'confirmed') {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 bg-[#174c36] text-white text-xs uppercase tracking-wider font-bold">
                        Confirmed
                      </span>
                    )
                  } else if (order.status === 'completed') {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 bg-[#003422] text-white text-xs uppercase tracking-wider font-bold">
                        Completed
                      </span>
                    )
                  } else if (order.status === 'processing') {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 bg-[#434343] text-white text-xs uppercase tracking-wider font-bold">
                        Processing
                      </span>
                    )
                  } else if (order.status === 'cancelled') {
                    statusBadge = (
                      <span className="inline-flex items-center px-2.5 py-0.5 bg-[#ba1a1a]/15 text-[#ba1a1a] text-xs uppercase tracking-wider font-bold">
                        Cancelled
                      </span>
                    )
                  }

                  return (
                    <tr key={order.orderId} className="hover:bg-[#fcf9f0] transition-colors">
                      <td className="py-4 px-6 font-bold text-[#003422] text-xs tracking-wider">
                        {order.orderId}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#1c1c17]">{order.customerName}</span>
                          <span className="text-xs text-[#404943]">{order.deliveryLocation}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-[#1c1c17]">
                        GH₵ {order.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-xs text-[#404943]">{order.createdAt}</td>
                      <td className="py-4 px-6">{statusBadge}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/${order.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${order.customerName}, regarding order ${order.orderId}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center bg-[#f1eee5] text-[#003422] hover:bg-[#003422] hover:text-white transition-colors"
                            title="WhatsApp Customer"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <Link
                            href="/admin/orders"
                            className="px-3 py-1.5 bg-[#003422] text-white text-xs uppercase tracking-wider hover:bg-[#174c36] transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 px-6 bg-[#f1eee5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#404943]">
          <span>
            Showing {recentOrders.length} of {totalOrders} recorded orders.
          </span>
        </div>
      </div>
    </div>
  )
}
