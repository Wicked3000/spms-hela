'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Save, X, User, CreditCard, MapPin, GraduationCap, Users, FileText, Upload, Trash2, Plus } from 'lucide-react'

type StudentFormData = {
  // Basic Information
  student_name: string
  gender: string
  age: number | null
  dob: string
  
  // ID Documents
  drivers_license: string
  passport_no: string
  nid_no: string
  birth_certificate: string
  
  // Banking Information
  bank_account_name: string
  bank_account_no: string
  bank_branch: string
  
  // Contact & Location
  contact_phone_no: string
  clan_name: string
  village_name: string
  ward_name: string
  llg_name: string
  district: string
  province: string
  
  // Family Information
  spouse_name: string
  no_of_children: number | null
  
  // Education
  last_grade_completed: string
  school_name: string
  certificate_no: string
  gpa: string
  year_completed: number | null
  
  // TVET/Career
  tvet_trade: string
  interested_country: string
  employment_type: string
  spoken_language: string
  
  // References
  referee_1: string
  referee_2: string
  referee_3: string
  study_aspiration: string
  
  // Father's Information
  fathers_full_name: string
  fathers_father_name: string
  fathers_mother_name: string
  fathers_occupation: string
  fathers_income_source: string
  fathers_education: string
  fathers_phone_no: string
  
  // Mother's Information
  mothers_full_name: string
  mothers_father_name: string
  mothers_mother_name: string
  mothers_occupation: string
  mothers_income: string
  mothers_education: string
  mothers_phone_no: string
}

const initialFormData: StudentFormData = {
  student_name: '',
  gender: '',
  age: null,
  dob: '',
  drivers_license: '',
  passport_no: '',
  nid_no: '',
  birth_certificate: '',
  bank_account_name: '',
  bank_account_no: '',
  bank_branch: '',
  contact_phone_no: '',
  clan_name: '',
  village_name: '',
  ward_name: '',
  llg_name: '',
  district: '',
  province: '',
  spouse_name: '',
  no_of_children: null,
  last_grade_completed: '',
  school_name: '',
  certificate_no: '',
  gpa: '',
  year_completed: null,
  tvet_trade: '',
  interested_country: '',
  employment_type: '',
  spoken_language: '',
  referee_1: '',
  referee_2: '',
  referee_3: '',
  study_aspiration: '',
  fathers_full_name: '',
  fathers_father_name: '',
  fathers_mother_name: '',
  fathers_occupation: '',
  fathers_income_source: '',
  fathers_education: '',
  fathers_phone_no: '',
  mothers_full_name: '',
  mothers_father_name: '',
  mothers_mother_name: '',
  mothers_occupation: '',
  mothers_income: '',
  mothers_education: '',
  mothers_phone_no: '',
}

interface StudentFormProps {
  initialData?: Partial<StudentFormData>
  studentId?: string
}

export default function StudentForm({ initialData, studentId }: StudentFormProps = {}) {
  const router = useRouter()
  const [formData, setFormData] = useState<StudentFormData>({
    ...initialFormData,
    ...initialData
  })
  const [saving, setSaving] = useState(false)

  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({})

  const handleChange = (field: keyof StudentFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (type: string, file: File | null) => {
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [type]: file }))
    } else {
      setSelectedFiles(prev => {
        const next = { ...prev }
        delete next[type]
        return next
      })
    }
  }

  const documentTypes = [
    { id: 'birth_certificate', label: 'Birth Certificate' },
    { id: 'nid_card', label: 'NID Card' },
    { id: 'passport', label: 'Passport' },
    { id: 'grade_10_cert', label: 'Grade 10 Certificate' },
    { id: 'grade_12_cert', label: 'Grade 12 Certificate' },
    { id: 'tvet_cert', label: 'TVET Certificate' },
    { id: 'other', label: 'Other Support Documents' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.student_name || !formData.gender) {
      toast.error('Please fill in all required fields (Student Name and Gender)')
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      
      let student_id = studentId
      let error;
      
      if (studentId) {
        // Update existing student
        const { error: updateError } = await supabase
          .from('student_profiles')
          .update(formData)
          .eq('id', studentId)
        error = updateError
      } else {
        // Create new student
        const { data: insertedData, error: insertError } = await supabase
          .from('student_profiles')
          .insert([formData])
          .select()
        error = insertError
        if (insertedData?.[0]) {
          student_id = insertedData[0].id
        }
      }

      if (error) throw error
      if (!student_id) throw new Error('Could not determine student ID for file upload')

      // Handle File Uploads
      const fileEntries = Object.entries(selectedFiles)
      if (fileEntries.length > 0) {
        toast.info(`Uploading ${fileEntries.length} documents...`)
        for (const [type, file] of fileEntries) {
          const fileName = `${type}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          const filePath = `${student_id}/${fileName}`
          
          const { error: uploadError } = await supabase.storage
            .from('student_documents')
            .upload(filePath, file)
            
          if (uploadError) {
            console.error(`Error uploading ${type}:`, uploadError)
            toast.error(`Failed to upload ${type}`)
          }
        }
      }

      toast.success(studentId ? 'Student profile updated successfully!' : 'Student profile created successfully!')
      
      // Redirect to students list after success
      router.push('/admin/students')
      router.refresh()
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/students')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <User className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Basic Information</h2>
            <p className="text-sm text-gray-400">Personal details and identification</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Student Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.student_name}
              onChange={(e) => handleChange('student_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender <span className="text-red-400">*</span>
            </label>
            <select
              aria-label="Select gender"
              required
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
            <input
              type="number"
              value={formData.age || ''}
              onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : null)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Enter age"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
            <input
              aria-label="Enter date of birth"
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ID Documents Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Identification Documents</h2>
            <p className="text-sm text-gray-400">Official identification numbers</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Driver&apos;s License</label>
            <input
              type="text"
              value={formData.drivers_license}
              onChange={(e) => handleChange('drivers_license', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="License number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Passport No</label>
            <input
              type="text"
              value={formData.passport_no}
              onChange={(e) => handleChange('passport_no', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Passport number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">NID No</label>
            <input
              type="text"
              value={formData.nid_no}
              onChange={(e) => handleChange('nid_no', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="National ID number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Birth Certificate</label>
            <input
              type="text"
              value={formData.birth_certificate}
              onChange={(e) => handleChange('birth_certificate', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Birth certificate number"
            />
          </div>
        </div>
      </div>

      {/* Banking Information Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
            <CreditCard className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Banking Information</h2>
            <p className="text-sm text-gray-400">Bank account details</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Bank Account Name</label>
            <input
              type="text"
              value={formData.bank_account_name}
              onChange={(e) => handleChange('bank_account_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Account holder name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bank Account No</label>
            <input
              type="text"
              value={formData.bank_account_no}
              onChange={(e) => handleChange('bank_account_no', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bank Branch</label>
            <input
              type="text"
              value={formData.bank_branch}
              onChange={(e) => handleChange('bank_branch', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Branch name"
            />
          </div>
        </div>
      </div>

      {/* Contact & Location Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
            <MapPin className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Contact & Location</h2>
            <p className="text-sm text-gray-400">Address and contact information</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone No</label>
            <input
              type="tel"
              value={formData.contact_phone_no}
              onChange={(e) => handleChange('contact_phone_no', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Clan Name</label>
            <input
              type="text"
              value={formData.clan_name}
              onChange={(e) => handleChange('clan_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Clan name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Village Name</label>
            <input
              type="text"
              value={formData.village_name}
              onChange={(e) => handleChange('village_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Village"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ward Name</label>
            <input
              type="text"
              value={formData.ward_name}
              onChange={(e) => handleChange('ward_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Ward"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">LLG Name</label>
            <input
              type="text"
              value={formData.llg_name}
              onChange={(e) => handleChange('llg_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="LLG"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">District</label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => handleChange('district', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="District"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Province</label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => handleChange('province', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Province"
            />
          </div>
        </div>
      </div>

      {/* Family Information Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
            <Users className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Family Information</h2>
            <p className="text-sm text-gray-400">Spouse and children details</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Spouse Name</label>
            <input
              type="text"
              value={formData.spouse_name}
              onChange={(e) => handleChange('spouse_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Spouse's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">No. of Children</label>
            <input
              type="number"
              value={formData.no_of_children || ''}
              onChange={(e) => handleChange('no_of_children', e.target.value ? parseInt(e.target.value) : null)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Number of children"
            />
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <GraduationCap className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Education Details</h2>
            <p className="text-sm text-gray-400">Academic background and qualifications</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Last Grade Completed</label>
            <input
              type="text"
              value={formData.last_grade_completed}
              onChange={(e) => handleChange('last_grade_completed', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="e.g., Grade 10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">School Name</label>
            <input
              type="text"
              value={formData.school_name}
              onChange={(e) => handleChange('school_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="School attended"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Certificate No</label>
            <input
              type="text"
              value={formData.certificate_no}
              onChange={(e) => handleChange('certificate_no', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Certificate number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">GPA</label>
            <input
              type="text"
              value={formData.gpa}
              onChange={(e) => handleChange('gpa', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Grade point average"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Year Completed</label>
            <input
              type="number"
              value={formData.year_completed || ''}
              onChange={(e) => handleChange('year_completed', e.target.value ? parseInt(e.target.value) : null)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Year of completion"
            />
          </div>
        </div>
      </div>

      {/* TVET/Career Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
            <GraduationCap className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">TVET & Career Information</h2>
            <p className="text-sm text-gray-400">Vocational training and career aspirations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">TVET Trade</label>
            <input
              type="text"
              value={formData.tvet_trade}
              onChange={(e) => handleChange('tvet_trade', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="e.g., Carpentry, Welding"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Interested Country</label>
            <input
              type="text"
              value={formData.interested_country}
              onChange={(e) => handleChange('interested_country', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Country of interest"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Employment Type</label>
            <input
              type="text"
              value={formData.employment_type}
              onChange={(e) => handleChange('employment_type', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Type of employment"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Spoken Language</label>
            <input
              type="text"
              value={formData.spoken_language}
              onChange={(e) => handleChange('spoken_language', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Languages spoken"
            />
          </div>
        </div>
      </div>

      {/* References Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
            <Users className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">References</h2>
            <p className="text-sm text-gray-400">Character references and study goals</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Referee 1</label>
            <input
              type="text"
              value={formData.referee_1}
              onChange={(e) => handleChange('referee_1', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="First referee name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Referee 2</label>
            <input
              type="text"
              value={formData.referee_2}
              onChange={(e) => handleChange('referee_2', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Second referee name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Referee 3</label>
            <input
              type="text"
              value={formData.referee_3}
              onChange={(e) => handleChange('referee_3', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Third referee name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Study Aspiration</label>
            <input
              type="text"
              value={formData.study_aspiration}
              onChange={(e) => handleChange('study_aspiration', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Study goals"
            />
          </div>
        </div>
      </div>

      {/* Father's Information Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
            <User className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Father&apos;s Information</h2>
            <p className="text-sm text-gray-400">Paternal family details</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Father&apos;s Full Name</label>
            <input
              type="text"
              value={formData.fathers_full_name}
              onChange={(e) => handleChange('fathers_full_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Father's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Father&apos;s Father Name</label>
            <input
              type="text"
              value={formData.fathers_father_name}
              onChange={(e) => handleChange('fathers_father_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Paternal grandfather"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Father&apos;s Mother Name</label>
            <input
              type="text"
              value={formData.fathers_mother_name}
              onChange={(e) => handleChange('fathers_mother_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Paternal grandmother"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Father&apos;s Occupation</label>
            <input
              type="text"
              value={formData.fathers_occupation}
              onChange={(e) => handleChange('fathers_occupation', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Occupation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Father&apos;s Income Source</label>
            <input
              type="text"
              value={formData.fathers_income_source}
              onChange={(e) => handleChange('fathers_income_source', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Income source"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Father&apos;s Education</label>
            <input
              type="text"
              value={formData.fathers_education}
              onChange={(e) => handleChange('fathers_education', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Education level"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Father&apos;s Phone No</label>
            <input
              type="tel"
              value={formData.fathers_phone_no}
              onChange={(e) => handleChange('fathers_phone_no', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Phone number"
            />
          </div>
        </div>
      </div>

      {/* Mother's Information Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10">
            <User className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Mother&apos;s Information</h2>
            <p className="text-sm text-gray-400">Maternal family details</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Mother&apos;s Full Name</label>
            <input
              type="text"
              value={formData.mothers_full_name}
              onChange={(e) => handleChange('mothers_full_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Mother's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mother&apos;s Father Name</label>
            <input
              type="text"
              value={formData.mothers_father_name}
              onChange={(e) => handleChange('mothers_father_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Maternal grandfather"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mother&apos;s Mother Name</label>
            <input
              type="text"
              value={formData.mothers_mother_name}
              onChange={(e) => handleChange('mothers_mother_name', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Maternal grandmother"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mother&apos;s Occupation</label>
            <input
              type="text"
              value={formData.mothers_occupation}
              onChange={(e) => handleChange('mothers_occupation', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Occupation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mother&apos;s Income</label>
            <input
              type="text"
              value={formData.mothers_income}
              onChange={(e) => handleChange('mothers_income', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Income"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mother&apos;s Education</label>
            <input
              type="text"
              value={formData.mothers_education}
              onChange={(e) => handleChange('mothers_education', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Education level"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mother&apos;s Phone No</label>
            <input
              type="tel"
              value={formData.mothers_phone_no}
              onChange={(e) => handleChange('mothers_phone_no', e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              placeholder="Phone number"
            />
          </div>
        </div>
      </div>

      {/* Student Documents Section */}
      <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
            <Upload className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Student Documents</h2>
            <p className="text-sm text-gray-400">Upload certificates, IDs, and transcripts</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentTypes.map((doc) => (
            <div key={doc.id} className="relative p-4 rounded-lg bg-[#1E293B] border border-white/5 hover:border-orange-500/30 transition-all">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {doc.label}
              </label>
              
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="file"
                    id={`file-${doc.id}`}
                    className="hidden"
                    onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] || null)}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor={`file-${doc.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/20 cursor-pointer transition-all w-full"
                  >
                    {selectedFiles[doc.id] ? (
                      <span className="text-green-400 truncate max-w-[200px]">
                        {selectedFiles[doc.id].name}
                      </span>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Select File
                      </>
                    )}
                  </label>
                </div>
                
                {selectedFiles[doc.id] && (
                  <button
                    type="button"
                    onClick={() => handleFileChange(doc.id, null)}
                    className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                    title="Remove file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-[10px] text-gray-500">
                Accepted formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50 transition-colors"
        >
          <X className="h-5 w-5" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Student
            </>
          )}
        </button>
      </div>
    </form>
  )
}
