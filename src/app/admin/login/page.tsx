'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, UserPlus, LogIn, Lock, Mail, User } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => {
        setHasAdmin(Boolean(data.hasAdmin))
      })
      .catch(() => setHasAdmin(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const isCreating = !hasAdmin

    if (isCreating) {
      if (!name.trim()) {
        setError('Please enter your full name')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isCreating ? 'create-first-user' : 'login',
          name,
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed. Please try again.')
        setLoading(false)
        return
      }

      setSuccess(
        isCreating
          ? 'Admin account created successfully! Redirecting...'
          : 'Authentication successful! Redirecting...'
      )

      setTimeout(() => {
        router.push('/admin')
        router.refresh()
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  if (hasAdmin === null) {
    return (
      <div className="min-h-screen bg-[#fcf9f0] flex items-center justify-center p-4">
        <div className="text-xs uppercase tracking-widest text-[#404943] animate-pulse">
          Loading Blessed Portal Security...
        </div>
      </div>
    )
  }

  const isCreating = !hasAdmin

  return (
    <div className="min-h-screen bg-[#fcf9f0] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#f6f3ea] border border-[#003422]/15 p-8 shadow-sm">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#003422] flex items-center justify-center text-[#ffcd70] font-headline font-bold text-2xl mb-4">
            B
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#7c5800] font-bold block mb-1">
            Operations & Administration
          </span>
          <h1 className="font-headline text-2xl sm:text-3xl text-[#003422] font-semibold">
            {isCreating ? 'Create Admin Account' : 'Administrator Sign In'}
          </h1>
          <p className="text-xs text-[#404943] mt-2 max-w-xs">
            {isCreating
              ? 'No administrator found. Create your master credentials to configure Blessed Drinks.'
              : 'Enter your verified credentials to access drink formulations and orders.'}
          </p>
        </div>

        {/* Error or Success Notice */}
        {error && (
          <div className="mb-6 p-4 bg-[#ba1a1a]/10 border border-[#ba1a1a]/30 text-[#ba1a1a] text-xs leading-relaxed">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-[#003422]/10 border border-[#003422]/30 text-[#003422] text-xs font-semibold leading-relaxed flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7c5800]" />
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isCreating && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#404943] font-semibold mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full px-4 py-3 pl-10 bg-[#fcf9f0] border border-[#003422]/20 text-sm text-[#1c1c17] focus:outline-none focus:border-[#003422]"
                />
                <User className="w-4 h-4 text-[#7c5800] absolute left-3 top-3.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#404943] font-semibold mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@blesseddrinks.com"
                className="w-full px-4 py-3 pl-10 bg-[#fcf9f0] border border-[#003422]/20 text-sm text-[#1c1c17] focus:outline-none focus:border-[#003422]"
              />
              <Mail className="w-4 h-4 text-[#7c5800] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#404943] font-semibold mb-1">
              Password {isCreating && <span className="text-[10px] text-[#7c5800]">(min. 6 characters)</span>}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 pl-10 bg-[#fcf9f0] border border-[#003422]/20 text-sm text-[#1c1c17] focus:outline-none focus:border-[#003422]"
              />
              <Lock className="w-4 h-4 text-[#7c5800] absolute left-3 top-3.5" />
            </div>
          </div>

          {isCreating && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#404943] font-semibold mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pl-10 bg-[#fcf9f0] border border-[#003422]/20 text-sm text-[#1c1c17] focus:outline-none focus:border-[#003422]"
                />
                <Lock className="w-4 h-4 text-[#7c5800] absolute left-3 top-3.5" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-4 px-6 bg-[#003422] text-[#fcf9f0] text-xs uppercase font-semibold tracking-widest hover:bg-[#174c36] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span>Processing Credentials...</span>
            ) : isCreating ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Master Admin Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In To Operations</span>
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="mt-8 pt-4 border-t border-[#003422]/10 text-center">
          <span className="text-[10px] uppercase tracking-wider text-[#404943] block">
            Payload CMS Authentication & Neon PostgreSQL
          </span>
        </div>
      </div>
    </div>
  )
}
