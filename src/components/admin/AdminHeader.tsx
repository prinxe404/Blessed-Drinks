'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, LogOut, Menu } from 'lucide-react'

export function AdminHeader({ title, onMenuClick }: { title?: string; onMenuClick?: () => void }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      })
      router.push('/admin/login')
      router.refresh()
    } catch (e) {
      router.push('/admin/login')
    }
  }

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-[#fcf9f0]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#003422]/10 z-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-3">
        <span className="font-headline text-xl text-[#003422] font-semibold">
          {title || 'Blessed Drinks Operations'}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/"
          target="_blank"
          className="text-xs uppercase tracking-wider text-[#404943] hover:text-[#003422] transition-colors"
          title="Preview Storefront"
        >
          View Storefront ↗
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ba1a1a]/10 text-xs font-semibold uppercase tracking-wider transition-colors"
          title="Sign out of Admin Dashboard"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  )
}
