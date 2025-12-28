
import { createClient } from '@/lib/supabase/server'
import StudentForm from '@/components/admin/StudentForm'
import { notFound } from 'next/navigation'

export default async function EditStudentPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: student, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !student) {
        notFound()
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Student</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Update student profile information.
                </p>
            </div>
            {/* The form expects data matching the StudentData type, verify if mapping is needed */}
            <StudentForm initialData={student} studentId={id} />
        </div>
    )
}
