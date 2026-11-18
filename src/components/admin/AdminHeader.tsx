import Link from 'next/link'
import { User, ShoppingBag } from 'lucide-react'

export function AdminHeader({ title }: { title?: string }) {
  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-[#fcf9f0]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#003422]/10 z-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
        <span className="font-headline text-xl text-[#003422] font-semibold">
          {title || 'Blessed Drinks Operations'}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/cart"
          className="relative p-2 text-[#1c1c17] hover:text-[#003422] transition-colors"
          title="Preview Cart"
        >
          <ShoppingBag className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#003422] text-white flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#1c1c17]">Blessed Admin</span>
            <span className="text-[10px] text-[#404943]">Accra Depot Lead</span>
          </div>
        </div>
      </div>
    </header>
  )
}
