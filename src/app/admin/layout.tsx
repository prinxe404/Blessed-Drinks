"use client"
import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="min-h-screen bg-[#fcf9f0] flex">
      {/* Sidebar – hidden on small screens, overlay when open */}
      <AdminSidebar
        className={`fixed inset-y-0 left-0 z-40 bg-[#f6f3ea] border-r border-[#003422]/10 transform transition-transform duration-200 md:relative md:translate-x-0 md:w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}
        // The component will ignore extra props it doesn't use; we will adjust it to accept className.
        // We'll also close the sidebar when a link is clicked (handled inside Sidebar).
      />
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'overflow-hidden' : ''}`}>
        <AdminHeader onMenuClick={toggleSidebar} />
        <main className="relative pt-20 bg-[#fcf9f0] min-h-[calc(100vh-5rem)] p-4 md:p-8">
          {children}
        </main>
      </div>
      {/* Dark overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}
