'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  BookmarkCheck, 
  User, 
  MapPin, 
  GraduationCap, 
  Wrench, 
  Eye, 
  BookOpen,
  Trash2,
  FileText,
  Clock
} from 'lucide-react'
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
  [key: string]: unknown
}

type Selection = {
  id: number
  user_id: string
  student_id: number
  selected_at: string
  notes: string | null
  status: string
  student_profiles: Student
}

interface UniversitySelectionsListProps {
  initialSelections: Selection[]
}

export default function UniversitySelectionsList({ initialSelections }: UniversitySelectionsListProps) {
  const [selections, setSelections] = useState<Selection[]>(initialSelections)
  const [loading, setLoading] = useState<number | null>(null)

  const handleRemoveSelection = async (selectionId: number, studentName: string) => {
    if (!confirm(`Are you sure you want to remove ${studentName} from your selections?`)) return
    
    setLoading(selectionId)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('student_selections')
        .delete()
        .eq('id', selectionId)

      if (error) throw error

      setSelections(selections.filter(s => s.id !== selectionId))
      toast.success(`Removed ${studentName} from your selections`)
    } catch (error) {
      console.error('Error removing selection:', error)
      toast.error('Failed to remove selection')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {selections.length === 0 ? (
        <div className="rounded-3xl bg-[#1E293B] p-16 text-center border border-dashed border-white/10">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
            <BookmarkCheck className="h-10 w-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your selection list is empty</h3>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            Browse our students and shortlist them for your admission review process.
          </p>
          <Link 
            href="/university/dashboard" 
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-bold text-white hover:bg-green-400 transition-all shadow-lg shadow-green-500/20"
          >
            Browse Students
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {selections.map((item) => {
            const student = item.student_profiles
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl bg-[#1E293B] border border-white/10 hover:border-green-500/30 transition-all duration-300"
              >
                {/* Header Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-500 text-white shadow-lg">
                    Selected
                  </span>
                </div>

                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center text-2xl font-bold text-white border border-white/10 group-hover:scale-105 transition-transform duration-300">
                      {student.student_name?.[0].toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white truncate mb-2">{student.student_name}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                         <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                          <User className="h-3 w-3" />
                          {student.gender}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          student.tvet_trade
                            ? 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20'
                            : 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20'
                        }`}>
                          {student.tvet_trade ? <Wrench className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                          {student.tvet_trade ? 'TVET' : 'FODE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{student.district}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{student.school_name || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{new Date(item.selected_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="truncate">Docs available</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Link
                      href={`/university/student/${student.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all border border-white/10"
                    >
                      <Eye className="h-4 w-4" />
                      Full Profile
                    </Link>
                    <button
                      onClick={() => handleRemoveSelection(item.id, student.student_name)}
                      disabled={loading === item.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                      title="Remove from selections"
                    >
                      {loading === item.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only">Remove</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
