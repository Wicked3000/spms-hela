import Link from 'next/link'
import { Smartphone, Monitor, ShieldAlert } from 'lucide-react'

export default function DeviceRestrictedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] p-4 text-center">
      <div className="max-w-lg rounded-2xl bg-[#1E293B] p-8 ring-1 ring-white/10 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
        <p className="text-gray-400 mb-8">
          Staff access is strictly prohibited on mobile phone devices to ensure security and data integrity.
        </p>

        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex flex-col items-center gap-2 opacity-50">
            <Smartphone className="h-12 w-12 text-red-500" />
            <span className="text-xs font-medium text-red-400">Mobile Phones</span>
            <span className="text-[10px] uppercase font-bold bg-red-500/10 text-red-400 px-2 py-0.5 rounded">Blocked</span>
          </div>
          
          <div className="h-12 w-px bg-white/10"></div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <Monitor className="h-12 w-12 text-green-500" />
            </div>
            <span className="text-xs font-medium text-green-400">Desktop / Tablet</span>
            <span className="text-[10px] uppercase font-bold bg-green-500/10 text-green-400 px-2 py-0.5 rounded">Allowed</span>
          </div>
        </div>

        <div className="bg-blue-500/10 rounded-lg p-4 text-sm text-blue-300 mb-8 max-w-sm mx-auto">
          Please log in using a Desktop, Laptop, or Tablet device to access the Admin Dashboard.
        </div>

        <Link 
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors w-full"
        >
          Return to Home Page
        </Link>
      </div>
    </div>
  )
}
