'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { BookmarkPlus, BookmarkCheck, FileText, User, MapPin, GraduationCap, Wrench, Eye, BookOpen } from 'lucide-react'
import Link from 'next/link'

type Student = {
  id: number
  student_name: string
  gender: string
  province: string
  district: string
  tvet_trade: string | null
  last_grade_completed: string | null
  school_name: string | null
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

type Selection = {
  id: number
  user_id: string
  student_id: number
  selected_at: string
  notes: string | null
  status: string
}

interface UniversityStudentsListProps {
  students: Student[]
  userSelections: Selection[]
  userId: string
}

export default function UniversityStudentsList({ students, userSelections, userId }: UniversityStudentsListProps) {
  const [selections, setSelections] = useState<Selection[]>(userSelections)
  const [loading, setLoading] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'TVET' | 'FODE'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const isSelected = (studentId: number) => {
    return selections.some(s => s.student_id === studentId)
  }

  const handleToggleSelection = async (studentId: number, studentName: string) => {
    setLoading(studentId)
    const supabase = createClient()

    try {
      const existing = selections.find(s => s.student_id === studentId)

      if (existing) {
        // Remove selection
        const { error } = await supabase
          .from('student_selections')
          .delete()
          .eq('id', existing.id)

        if (error) throw error

        setSelections(selections.filter(s => s.student_id !== studentId))
        toast.success(`Removed ${studentName} from your selections`)
      } else {
        // Add selection
        const { data, error } = await supabase
          .from('student_selections')
          .insert({
            user_id: userId,
            student_id: studentId,
            status: 'selected'
          })
          .select()
          .single()

        if (error) throw error

        setSelections([...selections, data])
        toast.success(`Added ${studentName} to your selections`)
      }
    } catch (error) {
      console.error('Error toggling selection:', error)
      toast.error('Failed to update selection. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesFilter = filter === 'all' || 
      (filter === 'TVET' && student.tvet_trade) ||
      (filter === 'FODE' && !student.tvet_trade)
    
    const matchesSearch = !searchQuery || 
      student.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.province?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.district?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, province, or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white ring-1 ring-white/10'
            }`}
          >
            All Students
          </button>
          <button
            onClick={() => setFilter('TVET')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              filter === 'TVET'
                ? 'bg-orange-500 text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white ring-1 ring-white/10'
            }`}
          >
            TVET
          </button>
          <button
            onClick={() => setFilter('FODE')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              filter === 'FODE'
                ? 'bg-blue-500 text-white'
                : 'bg-[#1E293B] text-gray-400 hover:text-white ring-1 ring-white/10'
            }`}
          >
            FODE
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing <span className="font-semibold text-white">{filteredStudents.length}</span> students
        </p>
        {selections.length > 0 && (
          <Link
            href="/university/selections"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white  rounded-lg hover:bg-green-400 transition-colors text-sm font-semibold"
          >
            <BookmarkCheck className="h-4 w-4" />
            View Selected ({selections.length})
          </Link>
        )}
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full rounded-xl bg-[#1E293B] p-12 text-center ring-1 ring-white/10">
            <User className="mx-auto h-12 w-12 text-gray-600" />
            <h3 className="mt-4 text- lg font-semibold text-white">No students found</h3>
            <p className="mt-2 text-sm text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const selected = isSelected(student.id)
            const isLoading = loading === student.id

            return (
              <div
                key={student.id}
                className={`relative overflow-hidden rounded-xl bg-[#1E293B] ring-1 transition-all ${
                  selected
                    ? 'ring-green-500/50 bg-green-500/5'
                    : 'ring-white/10 hover:ring-green-500/30'
                }`}
              >
                {/* Header */}
                <div className="border-b border-white/10 px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg">{student.student_name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                          <User className="h-3 w-3" />
                          {student.gender}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          student.tvet_trade
                            ? 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20'
                            : 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20'
                        }`}>
                          {student.tvet_trade ? <Wrench className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                          {student.tvet_trade ? 'TVET' : 'FODE'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleSelection(student.id, student.student_name)}
                      disabled={isLoading}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                        selected
                          ? 'bg-green-500 text-white hover:bg-green-400'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                      title={selected ? 'Remove from selections' : 'Add to selections'}
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : selected ? (
                        <BookmarkCheck className="h-5 w-5" />
                      ) : (
                        <BookmarkPlus className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{student.district}, {student.province}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span>{student.school_name || 'School not specified'}</span>
                  </div>
                  {student.tvet_trade && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Wrench className="h-4 w-4 text-gray-500" />
                      <span>{student.tvet_trade}</span>
                    </div>
                  )}
                  {student.last_grade_completed && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>Grade {student.last_grade_completed}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 px-6 py-3">
                  <Link
                    href={`/university/student/${student.id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-400 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    View Full Profile & Documents
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
