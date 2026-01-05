import { createClient } from '@/lib/supabase/server'
import { getUserProfile, isUniversity } from '@/lib/auth/roles'
import { redirect } from 'next/navigation'
import UniversityStudentsList from '@/components/university/UniversityStudentsList'
import { Users, BookmarkCheck } from 'lucide-react'

export default async function UniversityDashboardPage() {
  const supabase = await createClient()
  const profile = await getUserProfile()
  const hasAccess = await isUniversity()

  if (!profile || !hasAccess) {
    redirect('/university/login')
  }

  // Get all complete student profiles
  const { data: students, error } = await supabase
    .from('student_profiles')
    .select('*')
    .not('student_name', 'is', null)
    .not('gender', 'is', null)
    .not('age', 'is', null)
    .not('dob', 'is', null)
    .not('nid_no', 'is', null)
    .not('birth_certificate', 'is', null)
    .not('contact_phone_no', 'is', null)
    .not('province', 'is', null)
    .not('district', 'is', null)
    .order('created_at', { ascending: false })

  // Get user's selections
  const { data: selections } = await supabase
    .from('student_selections')
    .select('*')
    .eq('user_id', profile.id)

  // Get selection count
  const selectionCount = selections?.length || 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            <Users className="h-10 w-10 text-green-500" />
            Browse Candidates
          </h1>
          <p className="mt-2 text-gray-400 font-medium">
            Discover qualified candidates from Hela Province for your upcoming intake.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-3 rounded-2xl bg-[#1E293B] px-6 py-4 ring-1 ring-white/10 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-black text-white leading-none">{students?.length || 0}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Available</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#1E293B] px-6 py-4 ring-1 ring-white/10 shadow-xl">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <BookmarkCheck className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xl font-black text-white leading-none">{selectionCount}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Shortlisted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {error ? (
          <div className="rounded-3xl bg-red-500/5 p-12 text-center border border-dashed border-red-500/20">
            <p className="text-red-400 font-bold">Error loading student database. Please try refreshing or contact system administrator.</p>
          </div>
        ) : (
          <UniversityStudentsList 
            students={students || []} 
            userSelections={selections || []}
            userId={profile.id}
          />
        )}
      </div>
    </div>
  )
}
