'use client'

import { useState } from 'react'
import { Check, ShieldCheck } from 'lucide-react'
import { BusinessSettings } from '@/types'

interface SettingsManagerProps {
  initialSettings: BusinessSettings
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: name === 'deliveryFee' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_settings',
          settings,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setFeedback('Settings updated successfully!')
        setTimeout(() => setFeedback(null), 3000)
      } else {
        alert('Failed to update settings')
      }
    } catch (e) {
      alert('Network error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-[800px] mx-auto w-full space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-[#404943] block">
          Configuration & Dispatch Parameters
        </span>
        <h1 className="font-headline text-3xl text-[#003422] font-semibold">
          Business & WhatsApp Settings
        </h1>
        <p className="text-sm text-[#404943]">
          Manage WhatsApp business numbers, Accra delivery fees, operating hours, and storefront availability.
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-green-50 border border-green-300 text-green-800 text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-green-700" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 border border-[#003422]/15 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={settings.businessName}
              onChange={handleChange}
              required
              className="w-full bg-[#f6f3ea] px-4 py-2.5 text-sm border border-[#003422]/20 focus:outline-none font-semibold text-[#1c1c17]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={settings.tagline}
              onChange={handleChange}
              className="w-full bg-[#f6f3ea] px-4 py-2.5 text-sm border border-[#003422]/20 focus:outline-none text-[#1c1c17]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
              WhatsApp Business Number
            </label>
            <input
              type="text"
              name="whatsappNumber"
              value={settings.whatsappNumber}
              onChange={handleChange}
              required
              placeholder="233240001234"
              className="w-full bg-[#f6f3ea] px-4 py-2.5 text-sm border border-[#003422]/20 focus:outline-none font-mono text-[#003422] font-semibold"
            />
            <span className="text-[10px] text-[#404943]">
              International format without + or spaces (e.g. 233240001234)
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
              Standard Delivery Fee (GH₵)
            </label>
            <input
              type="number"
              step="0.01"
              name="deliveryFee"
              value={settings.deliveryFee}
              onChange={handleChange}
              required
              className="w-full bg-[#f6f3ea] px-4 py-2.5 text-sm border border-[#003422]/20 focus:outline-none font-bold text-[#003422]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
              Business Contact Phone
            </label>
            <input
              type="text"
              name="businessPhone"
              value={settings.businessPhone}
              onChange={handleChange}
              className="w-full bg-[#f6f3ea] px-4 py-2.5 text-sm border border-[#003422]/20 focus:outline-none text-[#1c1c17]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
              Business Email
            </label>
            <input
              type="email"
              name="businessEmail"
              value={settings.businessEmail}
              onChange={handleChange}
              className="w-full bg-[#f6f3ea] px-4 py-2.5 text-sm border border-[#003422]/20 focus:outline-none text-[#1c1c17]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
              Delivery Coverage Area
            </label>
            <input
              type="text"
              name="deliveryCoverage"
              value={settings.deliveryCoverage}
              onChange={handleChange}
              className="w-full bg-[#f6f3ea] px-4 py-2.5 text-sm border border-[#003422]/20 focus:outline-none text-[#1c1c17]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
              Store Status
            </label>
            <select
              name="storeStatus"
              value={settings.storeStatus}
              onChange={handleChange}
              className="w-full bg-[#f6f3ea] px-4 py-2.5 text-sm border border-[#003422]/20 focus:outline-none text-[#1c1c17]"
            >
              <option value="open">Open for Orders</option>
              <option value="closed">Temporarily Closed</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-[#003422]/10 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#003422] text-white px-6 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#174c36] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
