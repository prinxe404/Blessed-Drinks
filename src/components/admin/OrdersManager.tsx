'use client'

import { useState } from 'react'
import { MessageCircle, Check, MapPin, Phone, User, Clock, CheckCircle2 } from 'lucide-react'
import { OrderRecord } from '@/types'

interface OrdersManagerProps {
  initialOrders: OrderRecord[]
}

export function OrdersManager({ initialOrders }: OrdersManagerProps) {
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord>(initialOrders[0] || null)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null)

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (activeTab === 'pending') return ord.status === 'pending'
    if (activeTab === 'confirmed') return ord.status === 'confirmed'
    if (activeTab === 'processing') return ord.status === 'processing'
    if (activeTab === 'completed') return ord.status === 'completed'
    if (activeTab === 'cancelled') return ord.status === 'cancelled'
    return true
  })

  const handleStatusChange = async (newStatus: OrderRecord['status']) => {
    if (!selectedOrder) return

    setIsUpdatingStatus(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_order_status',
          orderId: selectedOrder.orderId,
          status: newStatus,
        }),
      })

      const data = await res.json()
      if (data.success) {
        const updated = { ...selectedOrder, status: newStatus }
        setSelectedOrder(updated)
        setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId ? updated : o)))
        setStatusFeedback(`Status successfully updated to ${newStatus.toUpperCase()}`)
        setTimeout(() => setStatusFeedback(null), 3000)
      } else {
        alert('Could not update status')
      }
    } catch (e) {
      alert('Network error')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <div className="max-w-[1360px] mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#003422]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-[#7c5800] font-bold">
              Logistics & Dispatch
            </span>
            <span className="text-[#c0c9c1]">/</span>
            <span className="text-xs uppercase tracking-widest text-[#404943]">Accra Metro Depot</span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl text-[#1c1c17] font-semibold">
            Order Management & Fulfillment
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#f1eee5] px-4 py-2 border border-[#003422]/10 text-xs text-[#1c1c17]">
            <span className="w-2 h-2 rounded-full bg-[#7c5800] animate-pulse"></span>
            <span className="uppercase tracking-wider font-semibold">
              WhatsApp Dispatch Gateway Active
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 7 Columns List, 5 Columns Dossier */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Orders List (7 Cols) */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-4">
          {/* Filter Bar */}
          <div className="bg-[#f6f3ea] p-4 flex flex-wrap items-center justify-between gap-3 border border-[#003422]/10">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {['all', 'pending', 'confirmed', 'processing', 'completed', 'cancelled'].map((tab) => {
                const count =
                  tab === 'all'
                    ? orders.length
                    : orders.filter((o) => o.status === tab).length

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 uppercase tracking-wider font-semibold transition-colors ${
                      activeTab === tab
                        ? 'bg-[#003422] text-white'
                        : 'bg-white text-[#404943] hover:text-[#1c1c17]'
                    }`}
                  >
                    {tab} ({count})
                  </button>
                )
              })}
            </div>

            <input
              type="text"
              placeholder="Search ref, name, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 px-3 py-1.5 text-xs bg-white border border-[#003422]/20 focus:outline-none"
            />
          </div>

          {/* Table */}
          <div className="bg-white border border-[#003422]/10 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#ebe8df] text-[#404943] text-xs uppercase tracking-wider border-b border-[#003422]/10">
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#003422]/5 text-xs text-[#1c1c17]">
                {filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.orderId === ord.orderId

                  let statusBadge = (
                    <span className="inline-block bg-[#ffcd70] text-[#785500] uppercase tracking-widest px-2 py-0.5 font-bold">
                      Pending
                    </span>
                  )

                  if (ord.status === 'confirmed') {
                    statusBadge = (
                      <span className="inline-block bg-[#174c36] text-white uppercase tracking-widest px-2 py-0.5 font-bold">
                        Confirmed
                      </span>
                    )
                  } else if (ord.status === 'completed') {
                    statusBadge = (
                      <span className="inline-block bg-[#003422] text-white uppercase tracking-widest px-2 py-0.5 font-bold">
                        Completed
                      </span>
                    )
                  } else if (ord.status === 'processing') {
                    statusBadge = (
                      <span className="inline-block bg-[#434343] text-white uppercase tracking-widest px-2 py-0.5 font-bold">
                        Processing
                      </span>
                    )
                  } else if (ord.status === 'cancelled') {
                    statusBadge = (
                      <span className="inline-block bg-red-100 text-red-800 uppercase tracking-widest px-2 py-0.5 font-bold">
                        Cancelled
                      </span>
                    )
                  }

                  return (
                    <tr
                      key={ord.orderId}
                      onClick={() => setSelectedOrder(ord)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#f1eee5]' : 'hover:bg-[#fcf9f0]'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-[#003422]">{ord.orderId}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold">{ord.customerName}</p>
                        <p className="text-[10px] text-[#404943]">{ord.phoneNumber}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#003422]">
                        GH₵ {ord.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-[#404943]">{ord.createdAt}</td>
                      <td className="py-3 px-4">{statusBadge}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          className={`uppercase tracking-wider font-semibold ${
                            isSelected ? 'text-[#7c5800] font-bold' : 'text-[#404943]'
                          }`}
                        >
                          {isSelected ? 'Viewing' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Live Order Dossier (5 Cols) */}
        {selectedOrder ? (
          <div className="col-span-12 xl:col-span-5 bg-white p-6 border border-[#003422]/15 shadow-md flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#003422]/10 bg-[#f6f3ea] -mx-6 -mt-6 p-6">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-widest text-[#7c5800] font-bold">
                    Live Order Dossier
                  </span>
                  <span className="text-[#c0c9c1]">|</span>
                  <span className="text-xs uppercase text-[#404943]">Direct Dispatch</span>
                </div>
                <h2 className="font-headline text-2xl text-[#003422] font-semibold mt-1">
                  Order {selectedOrder.orderId}
                </h2>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className="bg-white border border-[#003422]/20 px-3 py-2 text-xs uppercase font-semibold text-[#1c1c17] focus:outline-none cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {statusFeedback && (
              <div className="p-3 bg-green-50 border border-green-300 text-green-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>{statusFeedback}</span>
              </div>
            )}

            {/* Client Dossier */}
            <div className="bg-[#f6f3ea] p-4 flex flex-col gap-3 border border-[#003422]/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-[#404943] font-bold">
                  Client Dossier
                </span>
                <span className="text-[10px] uppercase tracking-wider bg-[#ebe8df] px-2 py-0.5 font-semibold text-[#1c1c17]">
                  Patron Profile
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-headline text-base text-[#1c1c17] font-semibold">
                  {selectedOrder.customerName}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#404943]">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedOrder.phoneNumber}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-[#404943]">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    {selectedOrder.deliveryAddress} ({selectedOrder.deliveryLocation})
                  </span>
                </div>
              </div>

              {selectedOrder.additionalInstructions && (
                <div className="bg-white p-3 border border-[#003422]/10">
                  <span className="text-[10px] uppercase tracking-widest text-[#7c5800] block mb-1 font-semibold">
                    Patron Directive
                  </span>
                  <p className="text-xs text-[#1c1c17] italic">
                    "{selectedOrder.additionalInstructions}"
                  </p>
                </div>
              )}

              {/* Direct WhatsApp Call to Action */}
              <a
                href={`https://wa.me/${selectedOrder.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedOrder.customerName}, regarding your Blessed Drinks order ${selectedOrder.orderId}: we have received it and are preparing your chilled harvest.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#003422] text-white text-xs uppercase tracking-wider py-3 px-4 hover:bg-[#174c36] transition-colors flex items-center justify-center gap-2 font-semibold shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#ffcd70]" />
                <span>Contact Customer via WhatsApp</span>
              </a>
            </div>

            {/* Botanical Allocation / Items */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-[#404943] font-bold">
                  Ordered Drinks Allocation
                </span>
                <span className="text-xs uppercase text-[#7c5800] font-bold">
                  {selectedOrder.items.length} Blends
                </span>
              </div>

              <div className="bg-[#f6f3ea] border border-[#003422]/10 divide-y divide-[#003422]/5">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#003422] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-[#1c1c17]">{item.productName}</p>
                        <p className="text-[10px] text-[#404943]">
                          @ GH₵ {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-xs text-[#003422]">
                        GH₵ {item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="p-3 flex items-center justify-between text-xs text-[#404943]">
                  <span>Direct Courier Delivery Fee</span>
                  <span className="font-semibold text-[#1c1c17]">
                    GH₵ {selectedOrder.deliveryFee.toFixed(2)}
                  </span>
                </div>

                <div className="p-4 bg-[#ebe8df] flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#003422]">
                    Total Order Value
                  </span>
                  <span className="font-headline text-lg font-bold text-[#003422]">
                    GH₵ {selectedOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
