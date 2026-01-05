import { createClient } from '@/lib/supabase/server'
import { getUserProfile, isUniversity } from '@/lib/auth/roles'
import { redirect } from 'next/navigation'
import UniversitySelectionsList from '@/components/university/UniversitySelectionsList'
import { BookmarkCheck, Users, Info } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UniversitySelectionsPage() {
  const supabase = await createClient()
  const profile = await getUserProfile()
  const hasAccess = await isUniversity()

  if (!profile || !hasAccess) {
    redirect('/university/login')
  }

  // Get user's selections with student profile data
  const { data: selections } = await supabase
    .from('student_selections')
    .select('*, student_profiles(*)')
    .eq('user_id', profile.id)
    .order('selected_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <BookmarkCheck className="h-10 w-10 text-green-500" />
            My Selections
          </h1>
          <p className="mt-2 text-gray-400 font-medium">
            Manage the candidates you have shortlisted for admission.
          </p>
        </div>
        
        <div className="flex items-center gap-3 rounded-2xl bg-[#1E293B] px-6 py-4 ring-1 ring-white/10">
          <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{selections?.length || 0}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Selected</p>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="rounded-3xl bg-blue-500/5 p-6 border border-blue-500/20 flex gap-4">
        <Info className="h-6 w-6 text-blue-400 flex-shrink-0" />
        <div className="text-sm text-blue-200/70">
          <p className="font-bold text-blue-400 mb-1 tracking-wide uppercase text-[10px]">Notice to University Representative</p>
          <p>
            The Hela Provincial Education Division has been notified of these selections. You can view full academic transcripts and identification documents for each candidate by clicking &quot;Full Profile&quot;.
          </p>
        </div>
      </div>

      <UniversitySelectionsList 
        initialSelections={selections || []} 
      />
    </div>
  )
}
