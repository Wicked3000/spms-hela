
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Users, AlertCircle } from 'lucide-react'
import StudentsTable from '@/components/admin/StudentsTable'

type StudentProfile = {
  id: number
  student_name: string | null
  gender: string | null
  age: number | null
  dob: string | null
  drivers_license: string | null
  passport_no: string | null
  nid_no: string | null
  birth_certificate: string | null
  bank_account_name: string | null
  bank_account_no: string | null
  bank_branch: string | null
  contact_phone_no: string | null
  clan_name: string | null
  village_name: string | null
  ward_name: string | null
  llg_name: string | null
  district: string | null
  province: string | null
  spouse_name: string | null
  no_of_children: number | null
  last_grade_completed: string | null
  school_name: string | null
  certificate_no: string | null
  gpa: string | null
  year_completed: number | null
  tvet_trade: string | null
  interested_country: string | null
  employment_type: string | null
  spoken_language: string | null
  referee_1: string | null
  referee_2: string | null
  referee_3: string | null
  study_aspiration: string | null
  fathers_full_name: string | null
  fathers_father_name: string | null
  fathers_mother_name: string | null
  fathers_occupation: string | null
  fathers_income_source: string | null
  fathers_education: string | null
  fathers_phone_no: string | null
  mothers_full_name: string | null
  mothers_father_name: string | null
  mothers_mother_name: string | null
  mothers_occupation: string | null
  mothers_income: string | null
  mothers_education: string | null
  mothers_phone_no: string | null
  created_at: string
  updated_at: string
}

const PAGE_SIZE = 50

async function getStudents(page: number = 1) {
  try {
    const supabase = await createClient()
    
    // Calculate pagination
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    
    const { data, error, count } = await supabase
      .from('student_profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Error fetching students:', error)
      return { students: [], count: 0, error: error.message }
    }

    return { students: data as StudentProfile[], count: count || 0, error: null }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { 
      students: [], 
      count: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1', 10)
  const { students, count, error } = await getStudents(currentPage)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Students Management</h1>
            <p className="mt-2 text-sm text-gray-400">
              View and edit all student profiles from Supabase
            </p>
          </div>
          <Link
            href="/admin/students/add"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-400 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Student
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 p-4 ring-1 ring-red-500/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Error Loading Students</p>
              <p className="text-xs text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Card */}
      <div className="mb-6 rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Student Records</p>
            <p className="text-3xl font-bold text-white">{count.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              Showing {PAGE_SIZE} students per page • All fields editable
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 rounded-xl bg-blue-500/10 p-4 ring-1 ring-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
              <span className="text-blue-400 font-bold">ℹ</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-400">How to Edit Students</h3>
            <ul className="mt-2 text-xs text-blue-300 space-y-1">
              <li>• Click <strong>Edit</strong> on any row to enable inline editing</li>
              <li>• Modify any field directly in the table</li>
              <li>• Click <strong>Save</strong> to update the record in Supabase</li>
              <li>• Click <strong>Cancel</strong> to discard changes</li>
              <li>• Use pagination controls to navigate through all {count.toLocaleString()} students</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!error && students.length === 0 ? (
        <div className="rounded-xl bg-[#0F172A] p-12 text-center ring-1 ring-white/10">
          <Users className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-white">No students found</h3>
          <p className="mt-2 text-sm text-gray-400">
            Get started by adding your first student profile.
          </p>
          <Link
            href="/admin/students/add"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-400 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Student
          </Link>
        </div>
      ) : (
        /* Students Table */
        <StudentsTable 
          initialStudents={students} 
          totalCount={count} 
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
        />
      )}

      {/* Footer Note */}
      <div className="mt-6 rounded-xl bg-yellow-500/10 p-4 ring-1 ring-yellow-500/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/20">
              <span className="text-yellow-400 font-bold">⚠</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-400">Important Notes</h3>
            <ul className="mt-2 text-xs text-yellow-300 space-y-1">
              <li>• <strong>ID, Created At, Updated At</strong> are system fields and cannot be edited</li>
              <li>• All other fields can be modified directly in the table</li>
              <li>• Changes are permanent and update the live Supabase database</li>
              <li>• Showing {PAGE_SIZE} students per page - use pagination to view all records</li>
              <li>• Scroll horizontally to view all 50 columns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
