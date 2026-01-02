'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Plus, Loader2, Trash2, Eye, EyeOff, Edit2, GraduationCap, Wrench, X } from 'lucide-react'

type CurriculumProgram = {
  id: number
  pathway: 'Academic' | 'Vocational'
  program_type: 'FODE' | 'TVET'
  title: string
  duration: string
  description: string | null
  subjects_or_skills: string[]
  certification: string | null
  status: 'Active' | 'Archived'
  created_at: string
}

const PATHWAYS = ['Academic', 'Vocational']
const PROGRAM_TYPES = ['FODE', 'TVET']

export default function CurriculumManagementPage() {
  const [programs, setPrograms] = useState<CurriculumProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProgram, setEditingProgram] = useState<CurriculumProgram | null>(null)
  
  const [formData, setFormData] = useState({
    pathway: 'Academic' as 'Academic' | 'Vocational',
    program_type: 'FODE' as 'FODE' | 'TVET',
    title: '',
    duration: '',
    description: '',
    certification: '',
    status: 'Active' as 'Active' | 'Archived'
  })
  
  const [subjectInput, setSubjectInput] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('curriculum_programs')
        .select('*')
        .order('pathway', { ascending: true })
        .order('program_type', { ascending: true })
        .order('id', { ascending: true })

      if (error) {
        if (error.message.includes('relation') || error.code === '42P01') {
          toast.error('Curriculum programs table not set up. Please run curriculum_programs_setup.sql')
          setPrograms([])
          setLoading(false)
          return
        }
        throw error
      }
      
      setPrograms(data || [])
    } catch (error) {
      console.error('Error fetching programs:', error)
      toast.error('Failed to load programs')
      setPrograms([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubject = () => {
    if (!subjectInput.trim()) return
    
    if (subjects.includes(subjectInput.trim())) {
      toast.error('This subject/skill is already added')
      return
    }
    
    setSubjects([...subjects, subjectInput.trim()])
    setSubjectInput('')
  }

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.duration || subjects.length === 0) {
      toast.error('Please fill in all required fields and add at least one subject/skill')
      return
    }

    setSaving(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const programData = {
        pathway: formData.pathway,
        program_type: formData.program_type,
        title: formData.title,
        duration: formData.duration,
        description: formData.description || null,
        subjects_or_skills: subjects,
        certification: formData.certification || null,
        status: formData.status
      }

      if (editingProgram) {
        // Update existing program
        const { error: updateError } = await supabase
          .from('curriculum_programs')
          .update(programData)
          .eq('id', editingProgram.id)

        if (updateError) throw updateError
        toast.success('Program updated successfully!')
      } else {
        // Insert new program
        const { error: insertError } = await supabase
          .from('curriculum_programs')
          .insert([programData])

        if (insertError) throw insertError
        toast.success('Program created successfully!')
      }
      
      // Reset form
      setFormData({
        pathway: 'Academic',
        program_type: 'FODE',
        title: '',
        duration: '',
        description: '',
        certification: '',
        status: 'Active'
      })
      setSubjects([])
      setShowForm(false)
      setEditingProgram(null)

      // Refresh programs
      fetchPrograms()
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save program')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (program: CurriculumProgram) => {
    setEditingProgram(program)
    setFormData({
      pathway: program.pathway,
      program_type: program.program_type,
      title: program.title,
      duration: program.duration,
      description: program.description || '',
      certification: program.certification || '',
      status: program.status
    })
    setSubjects(program.subjects_or_skills)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingProgram(null)
    setFormData({
      pathway: 'Academic',
      program_type: 'FODE',
      title: '',
      duration: '',
      description: '',
      certification: '',
      status: 'Active'
    })
    setSubjects([])
    setShowForm(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this program?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('curriculum_programs')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Program deleted successfully')
      fetchPrograms()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete program')
    }
  }

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const supabase = createClient()
      const newStatus = currentStatus === 'Active' ? 'Archived' : 'Active'

      const { error } = await supabase
        .from('curriculum_programs')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      toast.success(`Program ${newStatus === 'Active' ? 'activated' : 'archived'}`)
      fetchPrograms()
    } catch (error) {
      console.error('Status toggle error:', error)
      toast.error('Failed to update status')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Manage Curriculum Programs</h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage FODE and TVET programs for the Curriculum page
        </p>
      </div>

      {/* Add Program Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            if (showForm && editingProgram) {
              handleCancelEdit()
            } else {
              setShowForm(!showForm)
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          {showForm ? 'Hide Form' : 'Add New Program'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-8 rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
          <h2 className="text-lg font-semibold text-white mb-6">
            {editingProgram ? 'Edit Program' : 'Add New Program'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pathway <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.pathway}
                  onChange={(e) => setFormData({ ...formData, pathway: e.target.value as 'Academic' | 'Vocational' })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                >
                  {PATHWAYS.map(pathway => (
                    <option key={pathway} value={pathway}>{pathway}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Program Type <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.program_type}
                  onChange={(e) => setFormData({ ...formData, program_type: e.target.value as 'FODE' | 'TVET' })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                >
                  {PROGRAM_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Program title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  placeholder="e.g., 12 Months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  aria-label="Select status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Archived' })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Brief description of the program"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Certification
                </label>
                <input
                  type="text"
                  value={formData.certification}
                  onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Certification awarded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subjects/Skills <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
                    className="flex-1 bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                    placeholder="Enter subject or skill and press Add"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <span key={subject} className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400 ring-1 ring-green-500/20">
                        {subject}
                        <button
                          aria-label="Remove subject"
                          type="button"
                          onClick={() => handleRemoveSubject(subject)}
                          className="hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {subjects.length === 0 && (
                  <p className="text-xs text-gray-500">No subjects/skills added yet</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {editingProgram ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {editingProgram ? 'Update Program' : 'Create Program'}
                  </>
                )}
              </button>
              {editingProgram && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Programs List */}
      <div className="rounded-xl bg-[#0F172A] ring-1 ring-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">All Programs ({programs.length})</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto" />
            <p className="mt-4 text-sm text-gray-400">Loading programs...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="h-12 w-12 text-gray-600 mx-auto" />
            <p className="mt-4 text-sm text-gray-400">No programs created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-[#1E293B]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Pathway</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Subjects</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {programs.map((program) => (
                  <tr key={program.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-white">{program.title}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ring-1 ${
                        program.pathway === 'Academic'
                          ? 'bg-blue-500/10 text-blue-400 ring-blue-500/20'
                          : 'bg-orange-500/10 text-orange-400 ring-orange-500/20'
                      }`}>
                        {program.pathway === 'Academic' ? <GraduationCap className="h-3 w-3" /> : <Wrench className="h-3 w-3" />}
                        {program.pathway}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-400 ring-1 ring-purple-500/20">
                        {program.program_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{program.duration}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{program.subjects_or_skills.length}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ring-1 ${
                        program.status === 'Active' 
                          ? 'bg-green-500/10 text-green-400 ring-green-500/20' 
                          : 'bg-gray-500/10 text-gray-400 ring-gray-500/20'
                      }`}>
                        {program.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(program)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(program.id, program.status)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title={program.status === 'Active' ? 'Archive' : 'Activate'}
                        >
                          {program.status === 'Active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(program.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
