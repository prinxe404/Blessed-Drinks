'use client'

import { useCart } from '@/context/CartContext'
import { CheckCircle } from 'lucide-react'

export function CartToast() {
  const { toastVisible, toastMessage } = useCart()

  if (!toastVisible || !toastMessage) return null

  return (
    <div className="fixed bottom-8 right-8 z-50 bg-[#003422] text-[#fcf9f0] px-6 py-4 shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-100 border border-[#b8efd0]/20">
      <CheckCircle className="w-5 h-5 text-[#ffcd70]" />
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-[#b8efd0] font-semibold">
          Allocation Added
        </span>
        <span className="text-xs font-semibold text-white">{toastMessage}</span>
      </div>
    </div>
  )
}
