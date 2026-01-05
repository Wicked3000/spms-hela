
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, CheckCircle, XCircle, UserPlus, FileSpreadsheet, ArrowRight, AlertCircle, School } from 'lucide-react'

export const dynamic = 'force-dynamic'

type DashboardStats = {
  totalStudents: number
  tvetStudents: number
  fodeStudents: number
  totalUniversities: number
  totalSelections: number
  systemStatus: 'active' | 'inactive'
  error?: string
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = await createClient()
    
    // Total Students
    const { count: totalCount } = await supabase
      .from('student_profiles')
      .select('*', { count: 'exact', head: true })

    // TVET Students
    const { count: tvetCount } = await supabase
      .from('student_profiles')
      .select('*', { count: 'exact', head: true })
      .not('tvet_trade', 'is', null)

    // FODE Students
    const { count: fodeCount } = await supabase
      .from('student_profiles')
      .select('*', { count: 'exact', head: true })
      .is('tvet_trade', null)

    // University Users
    const { count: uniCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'university')

    // Selections
    const { count: selectionCount } = await supabase
      .from('student_selections')
      .select('*', { count: 'exact', head: true })

    return {
      totalStudents: totalCount || 0,
      tvetStudents: tvetCount || 0,
      fodeStudents: fodeCount || 0,
      totalUniversities: uniCount || 0,
      totalSelections: selectionCount || 0,
      systemStatus: 'active'
    }
  } catch (error) {
    console.error('Unexpected error in getDashboardStats:', error)
    return {
      totalStudents: 0,
      tvetStudents: 0,
      fodeStudents: 0,
      totalUniversities: 0,
      totalSelections: 0,
      systemStatus: 'inactive',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export default async function Dashboard() {
  const stats = await getDashboardStats()

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-400">Real-time overview of the Student Profile Management System</p>
      </div>

      {/* Error Alert */}
      {stats.error && (
        <div className="mb-6 rounded-xl bg-red-500/10 p-4 ring-1 ring-red-500/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Database Connection Issue</p>
              <p className="text-xs text-red-300 mt-1">{stats.error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Students */}
        <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10 hover:ring-green-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">Total Students</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">All registered profiles</p>
            </div>
          </div>
        </div>

        {/* Registered Universities */}
        <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10 hover:ring-blue-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
              <School className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">Universities</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalUniversities.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Authorized institutions</p>
            </div>
          </div>
        </div>

        {/* Student Selections */}
        <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10 hover:ring-purple-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">Total Selections</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalSelections.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Shortlisted candidates</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className={`rounded-xl bg-[#0F172A] p-6 ring-1 ${
          stats.systemStatus === 'active' 
            ? 'ring-green-500/20 hover:ring-green-500/40' 
            : 'ring-red-500/20 hover:ring-red-500/40'
        } transition-all`}>
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              stats.systemStatus === 'active' ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {stats.systemStatus === 'active' ? (
                <CheckCircle className="h-6 w-6 text-green-400" />
              ) : (
                <XCircle className="h-6 w-6 text-red-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">System Status</p>
              <p className={`text-3xl font-bold mt-1 ${
                stats.systemStatus === 'active' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stats.systemStatus === 'active' ? 'Active' : 'Inactive'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.systemStatus === 'active' ? 'Operational' : 'Issues detected'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/students"
            className="group flex items-center gap-4 rounded-xl bg-[#0F172A] p-5 ring-1 ring-white/10 hover:ring-green-500/50 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 group-hover:bg-green-500 transition-colors">
              <Users className="h-5 w-5 text-green-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Students</h3>
              <p className="text-xs text-gray-500">Manage profiles</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-green-400 transition-colors" />
          </Link>

          <Link
            href="/admin/universities"
            className="group flex items-center gap-4 rounded-xl bg-[#0F172A] p-5 ring-1 ring-white/10 hover:ring-blue-500/50 transition-all shadow-lg shadow-blue-500/5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500 transition-colors">
              <School className="h-5 w-5 text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">University Access</h3>
              <p className="text-xs text-gray-500">Grant permissions</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
          </Link>

          <Link
            href="/admin/students/add"
            className="group flex items-center gap-4 rounded-xl bg-[#0F172A] p-5 ring-1 ring-white/10 hover:ring-green-500/50 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500 transition-colors">
              <UserPlus className="h-5 w-5 text-emerald-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Add Student</h3>
              <p className="text-xs text-gray-500">Manual entry</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
          </Link>

          <Link
            href="/admin/import"
            className="group flex items-center gap-4 rounded-xl bg-[#0F172A] p-5 ring-1 ring-white/10 hover:ring-purple-500/50 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 group-hover:bg-purple-500 transition-colors">
              <FileSpreadsheet className="h-5 w-5 text-purple-400 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">Excel Import</h3>
              <p className="text-xs text-gray-500">Bulk upload</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
          </Link>
        </div>
      </div>

      {/* System Information */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">System Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Database Statistics */}
          <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Database Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Records</span>
                <span className="text-sm font-medium text-white">{stats.totalStudents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">TVET Enrolments</span>
                <span className="text-sm font-medium text-orange-400">{stats.tvetStudents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">FODE Enrolments</span>
                <span className="text-sm font-medium text-blue-400">{stats.fodeStudents.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Connection Status</span>
                  <span className={`text-sm font-medium ${
                    stats.systemStatus === 'active' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stats.systemStatus === 'active' ? '● Connected' : '● Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Distribution</h3>
            <div className="space-y-4">
              {stats.totalStudents > 0 ? (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">TVET</span>
                      <span className="text-sm font-medium text-orange-400">
                        {((stats.tvetStudents / stats.totalStudents) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${(stats.tvetStudents / stats.totalStudents) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">FODE</span>
                      <span className="text-sm font-medium text-blue-400">
                        {((stats.fodeStudents / stats.totalStudents) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(stats.fodeStudents / stats.totalStudents) * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
