'use client'

import { useState } from 'react'
import { Edit2, Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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

type StudentsTableProps = {
  initialStudents: StudentProfile[]
  totalCount: number
  currentPage: number
  pageSize: number
}

export default function StudentsTable({ initialStudents, totalCount, currentPage, pageSize }: StudentsTableProps) {
  const router = useRouter()
  const [students, setStudents] = useState<StudentProfile[]>(initialStudents)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<StudentProfile>>({})
  const [saving, setSaving] = useState(false)

  const totalPages = Math.ceil(totalCount / pageSize)
  const startRecord = (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalCount)

  const handleEdit = (student: StudentProfile) => {
    setEditingId(student.id)
    setEditData(student)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleSave = async () => {
    if (!editingId || !editData) return

    setSaving(true)
    try {
      const supabase = createClient()
      
      // Remove system fields from update
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _created_at, updated_at: _updated_at, ...updateData } = editData as StudentProfile

      const { error } = await supabase
        .from('student_profiles')
        .update(updateData)
        .eq('id', editingId)

      if (error) throw error

      // Update local state
      setStudents(students.map(s => 
        s.id === editingId ? { ...s, ...updateData, updated_at: new Date().toISOString() } : s
      ))

      toast.success('Student profile updated successfully')
      setEditingId(null)
      setEditData({})
    } catch (error) {
      console.error('Error updating student:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update student')
    } finally {
      setSaving(false)
    }
  }

  const handleFieldChange = (field: keyof StudentProfile, value: string | number | null) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  const handlePageChange = (newPage: number) => {
    router.push(`/admin/students?page=${newPage}`)
  }

  const renderCell = (student: StudentProfile, field: keyof StudentProfile) => {
    const isEditing = editingId === student.id
    const value = isEditing ? (editData[field] ?? student[field]) : student[field]

    // System fields - read only
    if (field === 'id' || field === 'created_at' || field === 'updated_at') {
      return <span className="text-gray-400 text-xs">{String(value || 'N/A')}</span>
    }

    if (!isEditing) {
      return <span className="text-gray-300">{String(value || 'N/A')}</span>
    }

    // Editable fields
    if (field === 'age' || field === 'no_of_children' || field === 'year_completed') {
      return (
        <input
          aria-label={`Edit ${field}`}
          type="number"
          value={value as number || ''}
          onChange={(e) => handleFieldChange(field, e.target.value ? parseInt(e.target.value) : null)}
          className="w-full bg-[#0F172A] border border-white/10 rounded px-2 py-1 text-white text-sm focus:border-green-500 focus:outline-none"
        />
      )
    }

    if (field === 'gender') {
      return (
        <select
          aria-label={`Edit ${field}`}
          value={value as string || ''}
          onChange={(e) => handleFieldChange(field, e.target.value || null)}
          className="w-full bg-[#0F172A] border border-white/10 rounded px-2 py-1 text-white text-sm focus:border-green-500 focus:outline-none"
        >
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      )
    }

    return (
      <input
        aria-label={`Edit ${field}`}
        type="text"
        value={value as string || ''}
        onChange={(e) => handleFieldChange(field, e.target.value || null)}
        className="w-full bg-[#0F172A] border border-white/10 rounded px-2 py-1 text-white text-sm focus:border-green-500 focus:outline-none"
      />
    )
  }

  const columns: { key: keyof StudentProfile; label: string; width?: string }[] = [
    { key: 'id', label: 'ID', width: 'w-16' },
    { key: 'student_name', label: 'Student Name', width: 'w-48' },
    { key: 'gender', label: 'Gender', width: 'w-24' },
    { key: 'age', label: 'Age', width: 'w-20' },
    { key: 'dob', label: 'Date of Birth', width: 'w-32' },
    { key: 'drivers_license', label: 'Driver License', width: 'w-32' },
    { key: 'passport_no', label: 'Passport No', width: 'w-32' },
    { key: 'nid_no', label: 'NID No', width: 'w-32' },
    { key: 'birth_certificate', label: 'Birth Certificate', width: 'w-36' },
    { key: 'bank_account_name', label: 'Bank Account Name', width: 'w-40' },
    { key: 'bank_account_no', label: 'Bank Account No', width: 'w-36' },
    { key: 'bank_branch', label: 'Bank Branch', width: 'w-32' },
    { key: 'contact_phone_no', label: 'Contact Phone', width: 'w-32' },
    { key: 'clan_name', label: 'Clan Name', width: 'w-32' },
    { key: 'village_name', label: 'Village Name', width: 'w-32' },
    { key: 'ward_name', label: 'Ward Name', width: 'w-32' },
    { key: 'llg_name', label: 'LLG Name', width: 'w-32' },
    { key: 'district', label: 'District', width: 'w-32' },
    { key: 'province', label: 'Province', width: 'w-32' },
    { key: 'spouse_name', label: 'Spouse Name', width: 'w-32' },
    { key: 'no_of_children', label: 'No. of Children', width: 'w-28' },
    { key: 'last_grade_completed', label: 'Last Grade', width: 'w-28' },
    { key: 'school_name', label: 'School Name', width: 'w-40' },
    { key: 'certificate_no', label: 'Certificate No', width: 'w-32' },
    { key: 'gpa', label: 'GPA', width: 'w-24' },
    { key: 'year_completed', label: 'Year Completed', width: 'w-32' },
    { key: 'tvet_trade', label: 'TVET Trade', width: 'w-32' },
    { key: 'interested_country', label: 'Interested Country', width: 'w-36' },
    { key: 'employment_type', label: 'Employment Type', width: 'w-36' },
    { key: 'spoken_language', label: 'Spoken Language', width: 'w-36' },
    { key: 'referee_1', label: 'Referee 1', width: 'w-32' },
    { key: 'referee_2', label: 'Referee 2', width: 'w-32' },
    { key: 'referee_3', label: 'Referee 3', width: 'w-32' },
    { key: 'study_aspiration', label: 'Study Aspiration', width: 'w-36' },
    { key: 'fathers_full_name', label: "Father's Full Name", width: 'w-40' },
    { key: 'fathers_father_name', label: "Father's Father", width: 'w-36' },
    { key: 'fathers_mother_name', label: "Father's Mother", width: 'w-36' },
    { key: 'fathers_occupation', label: "Father's Occupation", width: 'w-36' },
    { key: 'fathers_income_source', label: "Father's Income", width: 'w-36' },
    { key: 'fathers_education', label: "Father's Education", width: 'w-36' },
    { key: 'fathers_phone_no', label: "Father's Phone", width: 'w-32' },
    { key: 'mothers_full_name', label: "Mother's Full Name", width: 'w-40' },
    { key: 'mothers_father_name', label: "Mother's Father", width: 'w-36' },
    { key: 'mothers_mother_name', label: "Mother's Mother", width: 'w-36' },
    { key: 'mothers_occupation', label: "Mother's Occupation", width: 'w-36' },
    { key: 'mothers_income', label: "Mother's Income", width: 'w-32' },
    { key: 'mothers_education', label: "Mother's Education", width: 'w-36' },
    { key: 'mothers_phone_no', label: "Mother's Phone", width: 'w-32' },
    { key: 'created_at', label: 'Created At', width: 'w-40' },
    { key: 'updated_at', label: 'Updated At', width: 'w-40' },
  ]

  return (
    <div className="space-y-4">
      {/* Pagination Summary */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Showing <span className="font-semibold text-white">{students.length}</span> students
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total students: <span className="font-semibold text-white">{totalCount.toLocaleString()}</span>
          </p>
        </div>
        <div className="text-sm text-gray-400">
          Page <span className="font-semibold text-white">{currentPage}</span> of{' '}
          <span className="font-semibold text-white">{totalPages}</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-[#0F172A] ring-1 ring-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-[#1E293B]">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${col.width || 'w-32'}`}
                  >
                    {col.label}
                  </th>
                ))}
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student) => (
                <tr key={student.id} className={editingId === student.id ? 'bg-green-500/5' : 'hover:bg-white/5'}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-3 text-sm whitespace-nowrap">
                      {renderCell(student, col.key)}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-sm whitespace-nowrap text-right">
                    {editingId === student.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Save
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 disabled:opacity-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(student)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing {startRecord} to {endRecord} of {totalCount.toLocaleString()} students
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ring-1 ring-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {/* Show page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-green-500 text-white'
                      : 'bg-[#0F172A] text-gray-400 hover:bg-white/5 ring-1 ring-white/10'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ring-1 ring-white/10"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
