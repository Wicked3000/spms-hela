
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import Link from 'next/link'
import { Loader2, Lock, Mail, GraduationCap, ArrowLeft, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error('Login failed: ' + error.message)
        return
      }

      if (data.user) {
        toast.success('Login successful!')
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch (err) {
      console.error('Login error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="container-custom">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-green-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <span className="font-bold text-xl text-white">SPMS</span>
                <span className="font-bold text-xl text-yellow-400 ml-1">Hela</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-white">Admin Sign In</h1>
            <p className="text-gray-400 mt-2">Access the administration dashboard</p>
          </div>

          {/* Login Form */}
          <div className="rounded-2xl bg-[#1E293B] p-8 ring-1 ring-white/10">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full rounded-lg bg-[#0F172A] pl-11 pr-4 py-3 text-white text-sm ring-1 ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg bg-[#0F172A] pl-11 pr-4 py-3 text-white text-sm ring-1 ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-white hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Notice */}
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-green-500/10 p-4 ring-1 ring-green-500/20">
            <Shield className="h-5 w-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-gray-400">
              This area is restricted to authorized administrators from the Hela Province Education Office.
            </p>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Not an admin?{' '}
            <Link href="/profiles" className="font-medium text-green-400 hover:text-green-300 transition-colors">
              Browse Student Profiles
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
