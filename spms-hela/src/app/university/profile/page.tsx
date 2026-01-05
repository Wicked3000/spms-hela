import { getUserProfile, isUniversity } from '@/lib/auth/roles'
import { redirect } from 'next/navigation'
import UniversityProfileForm from '@/components/university/UniversityProfileForm'
import { UserCircle, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UniversityProfilePage() {
  const profile = await getUserProfile()
  const hasAccess = await isUniversity()

  if (!profile || !hasAccess) {
    redirect('/university/login')
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <UserCircle className="h-10 w-10 text-green-500" />
            University Profile
          </h1>
          <p className="mt-2 text-gray-400 font-medium">
            Manage your representative credentials and institution details.
          </p>
        </div>
        
        <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 ring-1 ring-green-500/20">
          <ShieldCheck className="h-4 w-4 text-green-400" />
          <span className="text-xs font-bold text-green-300 uppercase tracking-widest">Verified Institution</span>
        </div>
      </div>

      <UniversityProfileForm initialProfile={profile} />
    </div>
  )
}
