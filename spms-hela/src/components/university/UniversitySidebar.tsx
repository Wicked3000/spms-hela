'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  BookmarkCheck, 
  UserCircle, 
  LogOut,
  ChevronRight,
  School,
  Menu,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface UniversitySidebarProps {
  profile: {
    email: string;
    full_name: string | null;
    university_name: string | null;
  }
}

export default function UniversitySidebar({ profile }: UniversitySidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  const navigation = [
    { name: 'Browse Students', href: '/university/dashboard', icon: LayoutDashboard },
    { name: 'My Selections', href: '/university/selections', icon: BookmarkCheck },
    { name: 'University Profile', href: '/university/profile', icon: UserCircle },
  ]

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/university/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-green-500 text-white lg:hidden shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-72 bg-[#0F172A] border-r border-white/10 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex h-20 items-center gap-3 px-8 border-b border-white/10 bg-[#1E293B]/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 shadow-lg shadow-green-500/20">
              <School className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">HELA</span>
              <span className="text-xl font-light text-green-400 ml-1">Portal</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
              Main Menu
            </p>
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/20 ring-1 ring-green-400/50' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-green-400 transition-colors'}`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                </Link>
              )
            })}
          </nav>

          {/* User Info & Footer */}
          <div className="p-6 border-t border-white/10 bg-[#1E293B]/30 m-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center border border-white/10">
                <UserCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {profile.university_name || 'University Rep'}
                </p>
                <p className="text-xs text-gray-500 truncate">{profile.email}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:text-red-300 ring-1 ring-red-500/20 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
