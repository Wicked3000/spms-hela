import { createClient } from '@/lib/supabase/server'
import { getUserProfile, isUniversity } from '@/lib/auth/roles'
import { redirect, notFound } from 'next/navigation'
import { Download, ArrowLeft, User, MapPin, GraduationCap, FileText, Award, Phone, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function UniversityStudentPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const profile = await getUserProfile()
  const hasAccess = await isUniversity()

  if (!profile || !hasAccess) {
    redirect('/university/login')
  }

  // Get student data
  const { data: student, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !student) {
    notFound()
  }

  // Get documents from storage
  const { data: files } = await supabase
    .storage
    .from('student_documents')
    .list(`${id}/`, {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' }
    })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/university/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-green-400 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="rounded-2xl bg-[#1E293B] ring-1 ring-white/10 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold text-white">
                  {student.student_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {student.student_name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-green-100">
                    <span className="flex items-center gap-1.5 text-sm">
                      <MapPin className="h-4 w-4" /> {student.district}, {student.province}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm">
                      <GraduationCap className="h-4 w-4" /> {student.tvet_trade ? 'TVET' : 'FODE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
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
                    <dd className="mt-1 text-white">{student.student_name}</dd>
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
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Age</dt>
                    <dd className="mt-1 text-white">{student.age || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Phone</dt>
                    <dd className="mt-1 text-white flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {student.contact_phone_no || 'Not provided'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</dt>
                    <dd className="mt-1 text-white flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {student.village_name}, {student.district}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Identification */}
            <div className="rounded-2xl bg-[#1E293B] ring-1 ring-white/10 overflow-hidden">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-400" /> Identification Documents
                </h2>
              </div>
              <div className="p-6">
                <dl className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">NID Number</dt>
                    <dd className="mt-1 text-white">{student.nid_no || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Certificate</dt>
                    <dd className="mt-1 text-white">{student.birth_certificate || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Passport Number</dt>
                    <dd className="mt-1 text-white">{student.passport_no || 'None'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Driver&apos;s License</dt>
                    <dd className="mt-1 text-white">{student.drivers_license || 'None'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Academic Details */}
            <div className="rounded-2xl bg-[#1E293B] ring-1 ring-white/10 overflow-hidden">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-400" /> Academic Information
                </h2>
              </div>
              <div className="p-6">
                <dl className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</dt>
                    <dd className="mt-1 text-white">{student.school_name || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Grade Completed</dt>
                    <dd className="mt-1 text-white">{student.last_grade_completed || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Year Completed</dt>
                    <dd className="mt-1 text-white">{student.year_completed || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate No</dt>
                    <dd className="mt-1 text-white">{student.certificate_no || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</dt>
                    <dd className="mt-1 text-white">{student.gpa || 'N/A'}</dd>
                  </div>
                  {student.tvet_trade && (
                    <div>
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">TVET Trade</dt>
                      <dd className="mt-1 text-white">{student.tvet_trade}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents */}
            <div className="rounded-2xl bg-[#1E293B] p-6 ring-1 ring-white/10">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-400" /> Student Documents
              </h3>
              {files && files.length > 0 ? (
                <div className="space-y-2">
                  {files.map((file: { name: string }) => {
                    const { data: { publicUrl } } = supabase.storage
                      .from('student_documents')
                      .getPublicUrl(`${id}/${file.name}`)

                    return (
                      <a
                        key={file.name}
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-white truncate">{file.name}</span>
                        </div>
                        <Download className="h-4 w-4 text-gray-400 group-hover:text-green-400 flex-shrink-0" />
                      </a>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No documents uploaded yet</p>
              )}
            </div>

            {/* Quick Info */}
            <div className="rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 p-6 ring-1 ring-green-500/20">
              <h3 className="font-semibold text-white mb-2">University Portal</h3>
              <p className="text-sm text-gray-400">
                You have full access to this student&apos;s complete profile and all uploaded documents for admission review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
