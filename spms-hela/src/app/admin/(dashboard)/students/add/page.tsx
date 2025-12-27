
import StudentForm from '@/components/admin/StudentForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AddStudentPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">Add New Student</h1>
        <p className="mt-2 text-sm text-gray-400">
          Create a new student profile. All fields marked with <span className="text-red-400">*</span> are required.
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-6 rounded-xl bg-blue-500/10 p-4 ring-1 ring-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
              <span className="text-blue-400 font-bold">ℹ</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-400">Complete Profile Information</h3>
            <p className="mt-1 text-xs text-blue-300">
              Fill in all available information to create a complete student profile. 
              Profiles with all fields completed will be visible to the public.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <StudentForm />
    </div>
  )
}
