'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function UniversityLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Attempt sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw new Error(`Login failed: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('No user data returned from authentication')
      }

      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 500))

      // Check if user has university role
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle()
      
      if (profileError) {
        await supabase.auth.signOut()
        throw new Error(`Profile connection error. Please try again or contact support.`)
      }

      if (!profile) {
        await supabase.auth.signOut()
        throw new Error(
          `Your account exists but a profile has not been configured for portal access. ` +
          `Please contact the system administrator to authorize your university access.`
        )
      }

      if (profile.role !== 'university' && profile.role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error(`Access denied. This portal is reserved for authorized university representatives.`)
      }

      if (!profile.is_active) {
        await supabase.auth.signOut()
        throw new Error(`Your account is currently inactive. Please contact the administrator.`)
      }

      toast.success(`Welcome ${profile.full_name || profile.university_name || email}!`)
      
      // Small delay to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 300))
      
      router.push('/university/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.'
      toast.error(errorMessage, {
        duration: 8000, // Show error longer so user can read it
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="relative h-20 w-20 mb-2">
              <Image 
                src="https://i.ibb.co/Kzb2wbx1/Hela-SPMS-Logo.png" 
                alt="Hela SPMS Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl text-white">SPMS</span>
              <span className="font-bold text-2xl text-yellow-400 ml-1">Hela</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6">University Portal</h1>
          <p className="mt-2 text-gray-400">
            Access student profiles from Hela Province
          </p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl bg-[#1E293B] p-8 ring-1 ring-white/10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0F172A] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                  placeholder="university@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F172A] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have access?{' '}
              <Link href="/contact" className="text-green-400 hover:text-green-300 font-medium">
                Contact Admin
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
