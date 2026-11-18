'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, MessageCircle, ShieldCheck, ArrowLeft, Send } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function CartCheckoutPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart()

  const [fullName, setFullName] = useState('Kofi Mensah')
  const [phoneNumber, setPhoneNumber] = useState('24 555 8901')
  const [deliveryLocation, setDeliveryLocation] = useState('Greater Accra')
  const [deliveryAddress, setDeliveryAddress] = useState('House 14, Ringway Estates, Osu, Accra')
  const [additionalInstructions, setAdditionalInstructions] = useState(
    'Please deliver well chilled before 3 PM'
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const deliveryFee = 20.0
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee : 0

  // Real-time WhatsApp preformatted preview text
  const generatePreview = () => {
    let itemsText = ''
    items.forEach((it) => {
      const line = it.product.price * it.quantity
      itemsText += `  - ${it.quantity}x ${it.product.name} (GH₵ ${line.toFixed(2)})\n`
    })

    const fullPhone = phoneNumber.startsWith('+') ? phoneNumber : `+233 ${phoneNumber}`

    let msg =
      `Hello Blessed Drinks! I'd like to place an order:\n` +
      itemsText +
      `Delivery: ${deliveryAddress} (${deliveryLocation})\n` +
      `Customer: ${fullName} (${fullPhone})\n`

    if (additionalInstructions) {
      msg += `Notes: ${additionalInstructions}\n`
    }

    msg += `Total: GH₵ ${grandTotal.toFixed(2)}`
    return msg
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (items.length === 0) {
      setErrorMessage('Your bag is currently empty. Please add drinks before checking out.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        fullName,
        phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+233 ${phoneNumber}`,
        deliveryLocation,
        deliveryAddress,
        additionalInstructions,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        setErrorMessage(result.message || 'Error processing order. Please check your details.')
        setIsSubmitting(false)
        return
      }

      // Successful order creation: open WhatsApp and clear cart
      clearCart()
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, '_blank')
      }

      // Redirect to confirmation screen
      router.push(`/order-confirmed?ref=${encodeURIComponent(result.order.orderId)}`)
    } catch (err: any) {
      setErrorMessage('Network connection error. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f0]">
      <Header />

      <main className="w-full pt-24 pb-16 px-5 md:px-12 flex-1">
        <div className="max-w-[1360px] mx-auto">
          {/* Header & Breadcrumb */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#003422]/10 pb-6 mb-8">
            <div>
              <span className="text-xs uppercase text-[#7c5800] tracking-[0.2em] font-semibold block mb-1">
                Botanical Despatch Cart • Season {new Date().getFullYear()}
              </span>
              <h1 className="font-headline text-3xl sm:text-4xl text-[#003422] font-semibold tracking-tight">
                Your Reserved Infusions
              </h1>
            </div>

            <div className="flex items-center gap-4 text-[#404943] text-xs uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-[#003422] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#003422]"></span> 01 Order Review
              </span>
              <span className="text-[#c0c9c1]">/</span>
              <span className="flex items-center gap-1.5 text-[#7c5800] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#7c5800]"></span> 02 WhatsApp Concierge
              </span>
              <span className="text-[#c0c9c1]">/</span>
              <span className="text-[#717973]">03 MoMo Delivery</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Dual-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT COLUMN: Items and Breakdown (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-baseline justify-between bg-[#f1eee5] px-4 py-3 border border-[#003422]/10">
                <span className="text-xs uppercase tracking-wider text-[#1c1c17] font-semibold">
                  Itemized Harvest ({items.length} Blends)
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#404943]">
                  Accra Chilled Depot
                </span>
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="bg-[#f6f3ea] p-12 text-center border border-[#003422]/15 space-y-4">
                  <p className="font-headline text-xl text-[#003422]">Your bag is currently empty.</p>
                  <p className="text-xs text-[#404943]">
                    Explore our seasonal collection of authentic cold-pressed drinks.
                  </p>
                  <Link
                    href="/#drinks-catalog"
                    className="inline-flex items-center gap-2 bg-[#003422] text-[#fcf9f0] px-5 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#174c36] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Storefront</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => {
                    const lineSubtotal = item.product.price * item.quantity

                    return (
                      <div
                        key={item.product.id}
                        className="bg-[#f6f3ea] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#003422]/15 shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-24 bg-[#f1eee5] flex-shrink-0 overflow-hidden relative">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-1 left-1 bg-[#003422] text-white text-[9px] px-1.5 py-0.5 tracking-wider uppercase font-semibold">
                              Cold
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-[#7c5800] font-bold">
                              {item.product.volume || '330ml'}
                            </span>
                            <h2 className="font-headline text-lg text-[#1c1c17] font-semibold">
                              {item.product.name}
                            </h2>
                            <p className="text-xs text-[#404943]">{item.product.subtitle}</p>
                            <span className="text-xs text-[#003422] font-bold mt-1">
                              GH₵ {item.product.price.toFixed(2)} per bottle
                            </span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:pt-0 pt-2 border-t sm:border-t-0 border-[#003422]/10">
                          {/* Stepper */}
                          <div className="flex items-center bg-[#f1eee5] border border-[#003422]/20">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center font-bold text-[#1c1c17] hover:bg-[#003422] hover:text-white transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-[#1c1c17]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center font-bold text-[#1c1c17] hover:bg-[#003422] hover:text-white transition-colors"
                            >
                              +
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right min-w-[5rem]">
                            <span className="text-[10px] uppercase text-[#404943] block">Subtotal</span>
                            <span className="text-base font-bold text-[#003422]">
                              GH₵ {lineSubtotal.toFixed(2)}
                            </span>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            className="text-[#404943] hover:text-red-700 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Summary Ledger */}
              {items.length > 0 && (
                <div className="bg-[#ebe8df] p-6 flex flex-col gap-3 border border-[#003422]/10">
                  <div className="flex justify-between items-center text-[#1c1c17] text-sm">
                    <span>Botanical Subtotal</span>
                    <span className="font-semibold text-[#003422]">GH₵ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#1c1c17] text-sm">
                    <span className="flex items-center gap-2">
                      Direct Chilled Courier{' '}
                      <span className="text-[#7c5800] text-[10px] uppercase font-semibold">
                        (Accra & Tema Metro)
                      </span>
                    </span>
                    <span className="font-semibold text-[#003422]">
                      GH₵ {deliveryFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-3 mt-1 border-t border-[#003422]/15 flex justify-between items-baseline">
                    <div>
                      <span className="font-headline text-xl text-[#003422] uppercase block font-semibold">
                        Order Total
                      </span>
                      <span className="text-[11px] text-[#404943]">
                        VAT inclusive • Recyclable cork glass deposit included
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-headline text-2xl font-bold text-[#003422]">
                        GH₵ {grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Thermal Guarantee Callout */}
              <div className="bg-[#f6f3ea] p-4 border-l-4 border-[#003422] flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-[#003422] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <h3 className="text-xs uppercase tracking-wider text-[#003422] font-bold">
                    Thermal Integrity Guaranteed
                  </h3>
                  <p className="text-xs text-[#404943] leading-relaxed">
                    Every glass bottle is hand-stoppered and transported in chilled canvas coolers to
                    ensure crisp herb aromatics stay undisturbed from our workshop to your door.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: WhatsApp Checkout Form (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4 sticky top-24">
              <div className="bg-white p-6 sm:p-8 border border-[#003422]/20 shadow-md">
                <div className="border-b border-[#003422]/10 pb-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs uppercase tracking-widest text-[#7c5800] font-bold flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-[#7c5800]" /> Instant Concierge
                    </span>
                    <span className="bg-[#ffcd70] text-[#785500] px-2 py-0.5 text-[10px] tracking-wider uppercase font-bold">
                      No Account Needed
                    </span>
                  </div>
                  <h2 className="font-headline text-2xl text-[#003422] leading-tight font-semibold">
                    Express WhatsApp Checkout
                  </h2>
                  <p className="text-xs text-[#404943] mt-1 leading-relaxed">
                    No credit cards or passwords. We prepare and allocate your batch in direct
                    conversation with our Accra dispatch lead.
                  </p>
                </div>

                <form onSubmit={handleCheckout} className="flex flex-col gap-4">
                  {/* Customer Name */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="fullName"
                      className="text-xs uppercase tracking-wider text-[#1c1c17] font-semibold flex justify-between"
                    >
                      <span>
                        Full Name <span className="text-red-600">*</span>
                      </span>
                      <span className="text-[10px] text-[#404943]">e.g., Kofi Mensah</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#f6f3ea] px-4 py-2.5 text-[#1c1c17] text-sm border border-[#003422]/20 focus:border-[#003422] focus:outline-none"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="phoneNumber"
                      className="text-xs uppercase tracking-wider text-[#1c1c17] font-semibold flex justify-between"
                    >
                      <span>
                        WhatsApp Phone <span className="text-red-600">*</span>
                      </span>
                      <span className="text-[10px] text-[#404943]">e.g. 24 555 8901</span>
                    </label>
                    <div className="flex">
                      <span className="bg-[#ebe8df] px-3 py-2.5 border border-r-0 border-[#003422]/20 text-xs font-semibold text-[#003422] flex items-center">
                        GH (+233)
                      </span>
                      <input
                        id="phoneNumber"
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="24 555 8901"
                        className="w-full bg-[#f6f3ea] px-4 py-2.5 text-[#1c1c17] text-sm border border-[#003422]/20 focus:border-[#003422] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Delivery Location / Region */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="deliveryLocation"
                      className="text-xs uppercase tracking-wider text-[#1c1c17] font-semibold flex justify-between"
                    >
                      <span>
                        Delivery Location <span className="text-red-600">*</span>
                      </span>
                      <span className="text-[10px] text-[#404943]">e.g. East Legon, Osu, Tema</span>
                    </label>
                    <input
                      id="deliveryLocation"
                      type="text"
                      required
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-full bg-[#f6f3ea] px-4 py-2.5 text-[#1c1c17] text-sm border border-[#003422]/20 focus:border-[#003422] focus:outline-none"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="deliveryAddress"
                      className="text-xs uppercase tracking-wider text-[#1c1c17] font-semibold flex justify-between"
                    >
                      <span>
                        Street Address / Landmark <span className="text-red-600">*</span>
                      </span>
                      <span className="text-[10px] text-[#404943]">House & street</span>
                    </label>
                    <textarea
                      id="deliveryAddress"
                      rows={2}
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-[#f6f3ea] px-4 py-2 text-[#1c1c17] text-sm border border-[#003422]/20 focus:border-[#003422] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Optional Notes */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="additionalInstructions"
                      className="text-xs uppercase tracking-wider text-[#1c1c17] font-semibold flex justify-between"
                    >
                      <span>
                        Delivery Notes <span className="text-[#404943] font-normal">(Optional)</span>
                      </span>
                      <span className="text-[10px] text-[#404943]">Gate code, chill time</span>
                    </label>
                    <input
                      id="additionalInstructions"
                      type="text"
                      value={additionalInstructions}
                      onChange={(e) => setAdditionalInstructions(e.target.value)}
                      className="w-full bg-[#f6f3ea] px-4 py-2.5 text-[#1c1c17] text-sm border border-[#003422]/20 focus:border-[#003422] focus:outline-none"
                    />
                  </div>

                  {/* Pre-formatted Live Message Preview Deck */}
                  <div className="bg-[#f1eee5] p-3 border border-[#003422]/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-[#003422] font-bold flex items-center gap-1">
                        Live WhatsApp Preview
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-[#404943]">
                        Direct to Dispatch Desk
                      </span>
                    </div>
                    <pre className="font-mono text-[11px] leading-relaxed text-[#2d2d2d] whitespace-pre-wrap bg-white p-2.5 border border-[#c0c9c1]/40 select-all">
                      {generatePreview()}
                    </pre>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full bg-[#003422] hover:bg-[#174c36] text-white py-4 px-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors focus:outline-none active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Send className="w-4 h-4 text-[#ffcd70]" />
                    <span>
                      {isSubmitting
                        ? 'Saving Order & Redirecting...'
                        : `Continue to WhatsApp Order (GH₵ ${grandTotal.toFixed(2)})`}
                    </span>
                  </button>
                </form>

                {/* Trust Information */}
                <div className="mt-4 pt-4 border-t border-[#003422]/10 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#7c5800]">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide font-bold">
                      Mobile Money on Chat Confirmation
                    </span>
                  </div>
                  <p className="text-[11px] text-[#404943] leading-relaxed">
                    Payment is authorized via MTN MoMo or Telecel Cash merchant prompt once your dispatch
                    rider and delivery window are confirmed.
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-[#404943] text-[11px]">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#003422] rounded-full"></span> Accra: 45–90 min
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#003422] rounded-full"></span> Tema: Daily 2 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
