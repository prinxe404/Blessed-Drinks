'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Wine, Truck, Store, Settings as SettingsIcon } from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    {
      name: 'Analytics & Overview',
      href: '/admin',
      icon: BarChart3,
      exact: true,
    },
    {
      name: 'Drinks Inventory',
      href: '/admin/drinks',
      icon: Wine,
    },
    {
      name: 'WhatsApp Orders',
      href: '/admin/orders',
      icon: Truck,
    },
    {
      name: 'Business Settings',
      href: '/admin/settings',
      icon: SettingsIcon,
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#f6f3ea] border-r border-[#003422]/10 z-50 flex flex-col pt-6 pb-6">
      {/* Brand Header */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-[#003422] flex items-center justify-center text-[#ffcd70] font-headline font-bold text-xs">
            B
          </div>
          <span className="font-headline text-lg uppercase tracking-wider text-[#003422] font-semibold">
            BLESSED
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#404943] block">
          Operations Console
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider transition-all font-semibold ${
                isActive
                  ? 'bg-[#174c36] text-[#86bc9f]'
                  : 'text-[#404943] hover:bg-[#ebe8df] hover:text-[#1c1c17]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Storefront Link */}
      <div className="px-6 pt-4 border-t border-[#003422]/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#404943] hover:text-[#003422] transition-colors text-xs uppercase tracking-wider font-semibold"
        >
          <Store className="w-4 h-4" />
          <span>Customer Storefront</span>
        </Link>
      </div>
    </aside>
  )
}
