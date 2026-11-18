import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcf9f0]">
      <AdminSidebar />
      <div className="pl-64">
        <AdminHeader />
        <main className="relative pt-20 bg-[#fcf9f0] min-h-[calc(100vh-5rem)] p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
