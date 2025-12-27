
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Metadata } from 'next'
import SearchForm from '@/components/SearchForm'
import { 
  Search, 
  Users, 
  MapPin, 
  GraduationCap,
  Wrench,
  ExternalLink,
  Clock,
  User,
  BookOpen
} from 'lucide-react'

type StudentProfile = {
  id: string
  student_name: string
  first_name?: string
  last_name?: string
  gender: string
  province: string
  district: string | null
  stream?: string
  qualification?: string
  tvet_trade?: string
  created_at: string
}

async function getStudents(
  query: string, 
  stream?: string, 
  province?: string, 
  gender?: string,
  tvet_trade?: string,
  page: number = 1
) {
  const supabase = await createClient()
  const itemsPerPage = 12
  const from = (page - 1) * itemsPerPage
  const to = from + itemsPerPage - 1
  
  let dbQuery = supabase
    .from('student_profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    // Search across multiple fields - using individual conditions to handle nulls properly
    const searchTerm = `%${query}%`
    dbQuery = dbQuery.or(
      `student_name.ilike.${searchTerm},` +
      `contact_phone_no.ilike.${searchTerm},` +
      `bank_account_name.ilike.${searchTerm},` +
      `village_name.ilike.${searchTerm},` +
      `ward_name.ilike.${searchTerm},` +
      `school_name.ilike.${searchTerm}`
    )
  }

  // Only show complete profiles to public users
  // ALL fields must be filled (except system fields: id, created_at, updated_at)
  dbQuery = dbQuery
    // Basic Info
    .not('student_name', 'is', null)
    .not('gender', 'is', null)
    .not('age', 'is', null)
    .not('dob', 'is', null)
    // ID Documents
    .not('drivers_license', 'is', null)
    .not('passport_no', 'is', null)
    .not('nid_no', 'is', null)
    .not('birth_certificate', 'is', null)
    // Bank Info
    .not('bank_account_name', 'is', null)
    .not('bank_account_no', 'is', null)
    .not('bank_branch', 'is', null)
    // Contact & Location
    .not('contact_phone_no', 'is', null)
    .not('clan_name', 'is', null)
    .not('village_name', 'is', null)
    .not('ward_name', 'is', null)
    .not('llg_name', 'is', null)
    .not('district', 'is', null)
    .not('province', 'is', null)
    // Family Info
    .not('spouse_name', 'is', null)
    .not('no_of_children', 'is', null)
    // Education
    .not('last_grade_completed', 'is', null)
    .not('school_name', 'is', null)
    .not('certificate_no', 'is', null)
    .not('gpa', 'is', null)
    .not('year_completed', 'is', null)
    // TVET/Career
    .not('tvet_trade', 'is', null)
    .not('interested_country', 'is', null)
    .not('employment_type', 'is', null)
    .not('spoken_language', 'is', null)
    // References
    .not('referee_1', 'is', null)
    .not('referee_2', 'is', null)
    .not('referee_3', 'is', null)
    .not('study_aspiration', 'is', null)
    // Parents - Father
    .not('fathers_full_name', 'is', null)
    .not('fathers_father_name', 'is', null)
    .not('fathers_mother_name', 'is', null)
    .not('fathers_occupation', 'is', null)
    .not('fathers_income_source', 'is', null)
    .not('fathers_education', 'is', null)
    .not('fathers_phone_no', 'is', null)
    // Parents - Mother
    .not('mothers_full_name', 'is', null)
    .not('mothers_father_name', 'is', null)
    .not('mothers_mother_name', 'is', null)
    .not('mothers_occupation', 'is', null)
    .not('mothers_income', 'is', null)
    .not('mothers_education', 'is', null)
    .not('mothers_phone_no', 'is', null)
  
  // Adjusted filters based on available schema
  if (stream && stream !== 'all') {
    if (stream === 'TVET') {
      dbQuery = dbQuery.not('tvet_trade', 'is', null)
    } else if (stream === 'Academic') {
      dbQuery = dbQuery.is('tvet_trade', null)
    }
  }
  if (province && province !== 'all') {
    dbQuery = dbQuery.eq('province', province)
  }
  if (gender && gender !== 'all') {
    dbQuery = dbQuery.eq('gender', gender)
  }
  if (tvet_trade && tvet_trade !== 'all') {
    dbQuery = dbQuery.eq('tvet_trade', tvet_trade)
  }

  const { data, error, count } = await dbQuery

  if (error) {
    console.error('Error fetching students:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error
    })
    return { students: [], count: 0 }
  }

  // Map and infer missing fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const students = (data || []).map((s: any) => {
    // Infer stream if missing
    let inferredStream = s.stream
    if (!inferredStream) {
        if (s.tvet_trade) inferredStream = 'TVET'
        else if (s.last_grade_completed) inferredStream = 'Academic'
    }

    // Split name if first/last missing
    let first = s.first_name
    let last = s.last_name
    if (!first && !last && s.student_name) {
        const parts = s.student_name.trim().split(/\s+/)
        first = parts[0]
        last = parts.slice(1).join(' ')
    }

    return {
        ...s,
        first_name: first,
        last_name: last,
        stream: inferredStream
    }
  })

  return { students: students as StudentProfile[], count: count || 0 }
}

async function getStats() {
  const supabase = await createClient()
  
  const { count: totalCount } = await supabase
    .from('student_profiles')
    .select('*', { count: 'exact', head: true })

  const { count: tvetCount } = await supabase
    .from('student_profiles')
    .select('*', { count: 'exact', head: true })
    .not('tvet_trade', 'is', null)

  const { count: fodeCount } = await supabase
    .from('student_profiles')
    .select('*', { count: 'exact', head: true })
    .is('tvet_trade', null)

  const { data: provinces } = await supabase
    .from('student_profiles')
    .select('province')
    .limit(1000)

  const uniqueProvinces = new Set(provinces?.map(p => p.province).filter(Boolean))

  return {
    total: totalCount || 0,
    tvet: tvetCount || 0,
    fode: fodeCount || 0,
    provinces: uniqueProvinces.size
  }
}

export const metadata: Metadata = {
  title: 'Student Profiles | SPMS Hela',
  description: 'Browse verified student profiles from FODE and TVET programs in Hela Province. Search by stream, province, and trade.',
}

export default async function PublicProfilesPage(props: {
  searchParams: Promise<{ 
    q?: string
    stream?: string
    province?: string
    gender?: string
    tvet_trade?: string
    page?: string
  }>
}) {
  const awaitedParams = await props.searchParams
  const query = awaitedParams.q || ''
  const stream = awaitedParams.stream
  const province = awaitedParams.province
  const gender = awaitedParams.gender
  const tvet_trade = awaitedParams.tvet_trade
  const page = Number(awaitedParams.page) || 1

  // Create a plain object for the query to ensure no internal Next.js symbols are passed
  const queryParams = {
    q: query,
    stream,
    province,
    gender,
    tvet_trade,
    page: page.toString(),
  }
  
  // Remove undefined/empty values
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key as keyof typeof queryParams] === undefined || queryParams[key as keyof typeof queryParams] === '') {
      delete queryParams[key as keyof typeof queryParams]
    }
  })
  
  const { students, count } = await getStudents(query, stream, province, gender, tvet_trade, page)
  const stats = await getStats()
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-[#0F172A] min-h-screen">
      {/* Header Section */}
      <div className="bg-[#1E293B] py-12 border-b border-white/10">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Student Profiles</h1>
              <p className="mt-2 text-gray-400">
                Browse verified FODE and TVET students from <span className="text-yellow-400">Hela Province, Tari</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last Updated: {currentTime}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-[#0F172A] p-4 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total Students</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#0F172A] p-4 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.provinces}</p>
                  <p className="text-xs text-gray-500">Provinces</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#0F172A] p-4 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.tvet}</p>
                  <p className="text-xs text-gray-500">TVET Students</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-[#0F172A] p-4 ring-1 ring-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.fode}</p>
                  <p className="text-xs text-gray-500">FODE Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container-custom py-8">
        <SearchForm 
          query={query}
          stream={stream}
          province={province}
          gender={gender}
          tvet_trade={tvet_trade}
        />

        {/* Active Filters Display */}
        {(query || (stream && stream !== 'all') || (gender && gender !== 'all') || (province && province !== 'all') || (tvet_trade && tvet_trade !== 'all')) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-400">Active Filters:</span>
            
            {query && (
              <Link
                href={{
                  query: { ...queryParams, q: undefined }
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400 ring-1 ring-green-500/20 hover:bg-green-500/20 transition-colors"
              >
                <Search className="h-3 w-3" />
                Search: &quot;{query}&quot;
                <span className="ml-1 text-green-300">×</span>
              </Link>
            )}
            
            {stream && stream !== 'all' && (
              <Link
                href={{
                  query: { ...queryParams, stream: undefined }
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-blue-500/20 hover:bg-blue-500/20 transition-colors"
              >
                <GraduationCap className="h-3 w-3" />
                {stream === 'Academic' ? 'FODE' : stream}
                <span className="ml-1 text-blue-300">×</span>
              </Link>
            )}
            
            {gender && gender !== 'all' && (
              <Link
                href={{
                  query: { ...queryParams, gender: undefined }
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400 ring-1 ring-purple-500/20 hover:bg-purple-500/20 transition-colors"
              >
                <User className="h-3 w-3" />
                {gender}
                <span className="ml-1 text-purple-300">×</span>
              </Link>
            )}
            
            {province && province !== 'all' && (
              <Link
                href={{
                  query: { ...queryParams, province: undefined }
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-400 ring-1 ring-orange-500/20 hover:bg-orange-500/20 transition-colors"
              >
                <MapPin className="h-3 w-3" />
                {province}
                <span className="ml-1 text-orange-300">×</span>
              </Link>
            )}
            
            {tvet_trade && tvet_trade !== 'all' && (
              <Link
                href={{
                  query: { ...queryParams, tvet_trade: undefined }
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-400 ring-1 ring-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
              >
                <Wrench className="h-3 w-3" />
                {tvet_trade}
                <span className="ml-1 text-yellow-300">×</span>
              </Link>
            )}
            
            <Link
              href="/profiles"
              className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400 ring-1 ring-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              Clear All
            </Link>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing <span className="font-semibold text-white">{students.length}</span> of{' '}
            <span className="font-semibold text-white">{count}</span> students
          </p>
        </div>

        {/* Student Cards Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.length === 0 ? (
            <div className="col-span-full rounded-xl bg-[#1E293B] p-12 text-center ring-1 ring-white/10">
              <Users className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-4 text-lg font-semibold text-white">No students found</h3>
              <p className="mt-2 text-sm text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            students.map((student, index) => (
              <div
                key={student.id}
                className="relative overflow-hidden rounded-xl bg-[#1E293B] ring-1 ring-white/10 hover:ring-green-500/50 transition-all"
              >
                {/* Header with initials */}
                <div className="flex items-center gap-4 border-b border-white/10 px-4 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">
                    {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-xs text-gray-500">#{(index + 1).toString().padStart(3, '0')}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    student.stream === 'TVET' 
                      ? 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20' 
                      : 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20'
                  }`}>
                    {student.stream || 'N/A'}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{student.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{student.district || 'N/A'}, {student.province || 'N/A'}</span>
                  </div>
                  {student.stream === 'TVET' && student.tvet_trade && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Wrench className="h-4 w-4 text-gray-500" />
                      <span>{student.tvet_trade}</span>
                    </div>
                  )}
                  {student.stream === 'Academic' && student.qualification && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span>{student.qualification}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 px-4 py-3">
                  <Link
                    href={`/profile/${student.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-400 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> View Public Profile
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}<div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Link
              href={{
                query: { ...queryParams, page: page - 1 }
              }}
              className={`relative inline-flex items-center rounded-md border border-white/10 bg-[#1E293B] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#0F172A] ${
                page <= 1 ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Previous
            </Link>
            <Link
              href={{
                query: { ...queryParams, page: page + 1 }
              }}
              className={`relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-[#1E293B] px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#0F172A] ${
                page * 12 >= (count || 0) ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              Next
            </Link>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Showing <span className="font-semibold text-white">{(page - 1) * 12 + 1}</span> to{' '}
                <span className="font-semibold text-white">
                  {Math.min(page * 12, count || 0)}
                </span>{' '}
                of <span className="font-semibold text-white">{count}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Link
                  href={{
                    query: { ...queryParams, page: page - 1 }
                  }}
                  className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-[#1E293B] focus:z-20 focus:outline-offset-0 ${
                    page <= 1 ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  Previous
                </Link>
                {/* Simple current page indicator */}
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/10 focus:outline-offset-0 bg-green-500">
                  {page}
                </span>
                <Link
                  href={{
                    query: { ...queryParams, page: page + 1 }
                  }}
                  className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-[#1E293B] focus:z-20 focus:outline-offset-0 ${
                    page * 12 >= (count || 0) ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  <span className="sr-only">Next</span>
                  Next
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
