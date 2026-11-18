'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export function Header() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fcf9f0]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#003422]/10">
      <div className="h-20 w-full px-5 md:px-12 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#003422] flex items-center justify-center text-[#ffcd70] font-headline font-bold text-lg">
            B
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-xl uppercase tracking-wider text-[#003422] font-semibold leading-none">
              BLESSED DRINKS
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#404943] font-semibold">
              Ghanaian Artisanal
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-xs uppercase tracking-widest transition-colors ${
              pathname === '/'
                ? 'text-[#003422] font-bold border-b-2 border-[#003422] pb-1'
                : 'text-[#404943] hover:text-[#003422]'
            }`}
          >
            Home
          </Link>
          <a
            href="#drinks-catalog"
            className="text-xs uppercase tracking-widest text-[#404943] hover:text-[#003422] transition-colors"
          >
            Drinks
          </a>
          <a
            href="#about-section"
            className="text-xs uppercase tracking-widest text-[#404943] hover:text-[#003422] transition-colors"
          >
            About
          </a>
          <Link
            href="/admin"
            className={`text-xs uppercase tracking-widest transition-colors ${
              pathname.startsWith('/admin')
                ? 'text-[#003422] font-bold border-b-2 border-[#003422] pb-1'
                : 'text-[#404943] hover:text-[#003422]'
            }`}
          >
            Admin Portal
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            aria-label="View Shopping Cart"
            className="relative p-2 text-[#1c1c17] hover:text-[#003422] transition-colors flex items-center justify-center"
          >
            <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#ffcd70] text-[#785500] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin"
            title="Administrator Sign In"
            className="w-8 h-8 rounded-full bg-[#003422] text-white flex items-center justify-center hover:bg-[#174c36] transition-colors"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  )
}
