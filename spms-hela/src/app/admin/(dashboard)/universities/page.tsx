import UniversitiesTable from '@/components/admin/UniversitiesTable'
import { School, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminUniversitiesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            University Access Management
          </h1>
          <p className="mt-2 text-gray-400 max-w-2xl">
            Control which educational institutions have permission to access students&apos; confidential documents and profiles.
          </p>
        </div>
        
        <div className="flex items-center gap-2 rounded-2xl bg-green-500/10 px-4 py-2 ring-1 ring-green-500/20">
          <ShieldCheck className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium text-green-300">Secure Access Active</span>
        </div>
      </div>

      <UniversitiesTable />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-[#1E293B] p-6 ring-1 ring-white/10 hover:ring-green-500/30 transition-all group">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <School className="h-5 w-5 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Verified Institutes</h3>
          <p className="text-sm text-gray-400">
            Recommended to only grant access to verified higher education institutes in Papua New Guinea and overseas partners.
          </p>
        </div>

        <div className="rounded-2xl bg-[#1E293B] p-6 ring-1 ring-white/10 hover:ring-green-500/30 transition-all group">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Access Logs</h3>
          <p className="text-sm text-gray-400">
            Every file download or profile view is logged and tied to the specific university representative account.
          </p>
        </div>

        <div className="rounded-2xl bg-[#1E293B] p-6 ring-1 ring-white/10 hover:ring-green-500/30 transition-all group">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Data Privacy</h3>
          <p className="text-sm text-gray-400">
            Access can be revoked instantly. If a representative leaves the university, deactivating the account will block all access.
          </p>
        </div>
      </div>
    </div>
  )
}
