import { fetchSettings } from '@/lib/db'
import { SettingsManager } from '@/components/admin/SettingsManager'

export default async function AdminSettingsPage() {
  const settings = await fetchSettings()

  return <SettingsManager initialSettings={settings} />
}
