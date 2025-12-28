
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FileDown, ArrowLeft, MapPin, GraduationCap, User, Calendar, Award, Wrench, BookOpen, Globe } from 'lucide-react'

export default async function StudentProfilePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: student, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', id)
    .single()

  const { data: { user } } = await supabase.auth.getUser()

  if (error || !student) {
    notFound()
  }

  // Check if profile is complete (ALL fields required for public viewing)
  const isComplete = !!(
    // Basic Info
    student.student_name &&
    student.gender &&
    student.age &&
    student.dob &&
    // ID Documents
    student.drivers_license &&
    student.passport_no &&
    student.nid_no &&
    student.birth_certificate &&
    // Bank Info
    student.bank_account_name &&
    student.bank_account_no &&
    student.bank_branch &&
    // Contact & Location
    student.contact_phone_no &&
    student.clan_name &&
    student.village_name &&
    student.ward_name &&
    student.llg_name &&
    student.district &&
    student.province &&
    // Family Info
    student.spouse_name &&
    student.no_of_children &&
    // Education
    student.last_grade_completed &&
    student.school_name &&
    student.certificate_no &&
    student.gpa &&
    student.year_completed &&
    // TVET/Career
    student.tvet_trade &&
    student.interested_country &&
    student.employment_type &&
    student.spoken_language &&
    // References
    student.referee_1 &&
    student.referee_2 &&
    student.referee_3 &&
    student.study_aspiration &&
    // Parents - Father
    student.fathers_full_name &&
    student.fathers_father_name &&
    student.fathers_mother_name &&
    student.fathers_occupation &&
    student.fathers_income_source &&
    student.fathers_education &&
    student.fathers_phone_no &&
    // Parents - Mother
    student.mothers_full_name &&
    student.mothers_father_name &&
    student.mothers_mother_name &&
    student.mothers_occupation &&
    student.mothers_income &&
    student.mothers_education &&
    student.mothers_phone_no
  )

  // If profile is incomplete and user is not authenticated (not admin), show not found
  if (!isComplete && !user) {
    notFound()
  }

  return (
    <div className="bg-[#0F172A] min-h-screen py-12">
      <div className="container-custom">
        {/* Back Link */}
        <Link 
          href="/profiles" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-green-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Profiles
        </Link>
        
        {/* Header */}
        <div className="rounded-2xl bg-[#1E293B] ring-1 ring-white/10 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold text-white">
                  {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {student.first_name} {student.last_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-green-100">
                    <span className="flex items-center gap-1.5 text-sm">
                      <MapPin className="h-4 w-4" /> {student.district}, {student.province}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm">
                      <GraduationCap className="h-4 w-4" /> {student.stream}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href={`/api/pdf/${student.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors"
                >
                  <FileDown className="h-4 w-4" /> Download Summary
                </a>
                {user && student.document_url && (
                  <a
                    href={student.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
                  >
                    <FileDown className="h-4 w-4" /> View Transcript
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <div className="rounded-2xl bg-[#1E293B] ring-1 ring-white/10 overflow-hidden">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-green-400" /> Personal Details
                </h2>
              </div>
              <div className="p-6">
                <dl className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</dt>
                    <dd className="mt-1 text-white">{student.first_name} {student.last_name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</dt>
                    <dd className="mt-1 text-white">{student.gender || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</dt>
                    <dd className="mt-1 text-white flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {student.dob || 'Not provided'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</dt>
                    <dd className="mt-1 text-white flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {student.district}, {student.province}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Academic Details */}
            <div className="rounded-2xl bg-[#1E293B] ring-1 ring-white/10 overflow-hidden">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-400" /> Academic Details
                </h2>
              </div>
              <div className="p-6">
                <dl className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Education Stream</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                        student.stream === 'TVET' 
                          ? 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20' 
                          : 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'
                      }`}>
                        {student.stream === 'TVET' ? <Wrench className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                        {student.stream}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</dt>
                    <dd className="mt-1 text-white flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-400" />
                      {student.qualification || 'N/A'}
                    </dd>
                  </div>
                  {student.stream === 'TVET' && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">TVET Trade</dt>
                      <dd className="mt-1 text-white flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-orange-400" />
                        {student.tvet_trade || 'Not specified'}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <div className="rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 p-6 ring-1 ring-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Verified Profile</h3>
                  <p className="text-xs text-green-400">Official Hela Province Record</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                This profile is verified by the Hela Provincial Education Division. For official inquiries, contact the admission office.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-[#1E293B] p-6 ring-1 ring-white/10">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-400" /> Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href={`/api/pdf/${student.id}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-400 transition-colors"
                >
                  <FileDown className="h-4 w-4" /> Download PDF Profile
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors ring-1 ring-white/10"
                >
                  Contact for Verification
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="rounded-2xl bg-[#1E293B] p-6 ring-1 ring-white/10">
              <h3 className="font-semibold text-white mb-4">Need Help?</h3>
              <p className="text-sm text-gray-400 mb-4">
                For questions about this profile or to verify credentials, contact the Hela Province Education Office.
              </p>
              <Link 
                href="/contact" 
                className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
              >
                Get in touch →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
