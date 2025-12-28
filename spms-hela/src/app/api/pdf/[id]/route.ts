
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: student, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !student) {
      return new NextResponse('Student not found', { status: 404 })
  }

  // Create PDF
  const doc = new jsPDF()

  // Header
  doc.setFontSize(22)
  doc.setTextColor(15, 23, 42) // Slate 900
  doc.text('Hela Student Profile', 105, 20, { align: 'center' })
  
  doc.setLineWidth(0.5)
  doc.line(20, 25, 190, 25)

  // Personal Info
  doc.setFontSize(16)
  doc.text(student.student_name || 'Student', 20, 40)
  
  doc.setFontSize(12)
  doc.setTextColor(100)
  
  let yPos = 55
  
  const addRow = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold')
      doc.text(`${label}:`, 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(value || 'N/A', 70, yPos)
      yPos += 10
  }

  addRow('Gender', student.gender)
  addRow('Date of Birth', student.dob)
  addRow('Location', `${student.district}, ${student.province}`)
  addRow('Last Grade', student.last_grade_completed)
  addRow('School Name', student.school_name)
  addRow('Year Completed', student.year_completed ? String(student.year_completed) : 'N/A')
  addRow('Certificate No', student.certificate_no)
  if (student.tvet_trade) {
    addRow('TVET Trade', student.tvet_trade)
  }

  // Footer
  doc.setFontSize(10)
  doc.setTextColor(150)
  doc.text('Verified by Hela Provincial Education Division', 105, 280, { align: 'center' })
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 285, { align: 'center' })

  // Output
  const pdfBuffer = doc.output('arraybuffer')

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${(student.student_name || 'Student').replace(/ /g, '_')}_Profile.pdf"`,
    },
  })
}
