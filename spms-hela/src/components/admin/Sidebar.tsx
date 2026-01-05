
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileSpreadsheet, 
  LogOut,
  ChevronRight,
  FileText,
  FolderOpen,
  Shield,
  BookOpen,
  MessageSquare,
  School
} from 'lucide-react'
import { toast } from 'sonner'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'All Students', href: '/admin/students', icon: Users },
  { name: 'Add Student', href: '/admin/students/add', icon: UserPlus },
  { name: 'Excel Import', href: '/admin/import', icon: FileSpreadsheet },
  { name: 'Upload Documents', href: '/admin/publications', icon: FileText },
  { name: 'Helpful Resources', href: '/admin/resources', icon: FolderOpen },
  { name: 'Policy Documents', href: '/admin/policies', icon: Shield },
  { name: 'Curriculum', href: '/admin/curriculum', icon: BookOpen },
  { name: 'University Access', href: '/admin/universities', icon: School },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="flex h-full w-64 flex-col bg-[#0F172A] border-r border-white/10">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
        <Image 
          src="https://i.ibb.co/Kzb2wbx1/Hela-SPMS-Logo.png" 
          alt="Hela Province Logo" 
          width={36}
          height={36}
          className="h-9 w-9 object-contain rounded-lg"
        />
        <div>
          <span className="font-bold text-white">SPMS</span>
          <span className="font-bold text-yellow-400 ml-1">Admin</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Management
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`} />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3 space-y-1">
        <Link
          href="/profiles"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
        >
          <Users className="h-5 w-5 text-gray-500" />
          <span>View Public Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="h-5 w-5 text-gray-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
