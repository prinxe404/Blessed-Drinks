import { fetchSettings } from '@/lib/db'
import { SettingsManager } from '@/components/admin/SettingsManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminSettingsPage() {
  const settings = await fetchSettings()

  return <SettingsManager initialSettings={settings} />
}
