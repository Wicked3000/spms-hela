'use client'

import { useState, useRef } from 'react'
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type ImportResult = {
  totalRows: number
  successCount: number
  failedCount: number
  errors: { row: number; reason: string }[]
}

// Required columns that must match Supabase exactly
const REQUIRED_COLUMNS = [
  'student_name',
  'gender',
  'age',
  'dob',
  'drivers_license',
  'passport_no',
  'nid_no',
  'birth_certificate',
  'bank_account_name',
  'bank_account_no',
  'bank_branch',
  'contact_phone_no',
  'clan_name',
  'village_name',
  'ward_name',
  'llg_name',
  'district',
  'province',
  'spouse_name',
  'no_of_children',
  'last_grade_completed',
  'school_name',
  'certificate_no',
  'gpa',
  'year_completed',
  'tvet_trade',
  'interested_country',
  'employment_type',
  'spoken_language',
  'referee_1',
  'referee_2',
  'referee_3',
  'study_aspiration',
  'fathers_full_name',
  'fathers_father_name',
  'fathers_mother_name',
  'fathers_occupation',
  'fathers_income_source',
  'fathers_education',
  'fathers_phone_no',
  'mothers_full_name',
  'mothers_father_name',
  'mothers_mother_name',
  'mothers_occupation',
  'mothers_income',
  'mothers_education',
  'mothers_phone_no',
]

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateCSVTemplate = () => {
    const headers = REQUIRED_COLUMNS.join(',')
    const sampleRow = REQUIRED_COLUMNS.map(() => '').join(',')
    const csv = `${headers}\n${sampleRow}`
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_import_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success('Template downloaded successfully')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    
    if (!selectedFile) {
      setFile(null)
      return
    }

    // Check file type - only CSV allowed
    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Only CSV files are accepted. Excel files (.xls, .xlsx) are not supported.')
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setFile(selectedFile)
    setResult(null)
  }

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim())
    return lines.map(line => {
      // Simple CSV parsing (handles basic cases)
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())
      
      return values
    })
  }

  const validateHeaders = (headers: string[]): { valid: boolean; message?: string } => {
    const normalizedHeaders = headers.map(h => h.trim().toLowerCase())
    const normalizedRequired = REQUIRED_COLUMNS.map(c => c.toLowerCase())

    // Check if all required columns are present
    for (const required of normalizedRequired) {
      if (!normalizedHeaders.includes(required)) {
        return {
          valid: false,
          message: `Missing required column: "${required}". CSV headers must exactly match database column names.`
        }
      }
    }

    // Check for extra columns that don't match
    for (const header of normalizedHeaders) {
      if (header && !normalizedRequired.includes(header)) {
        return {
          valid: false,
          message: `Invalid column: "${header}". All column names must exactly match the database schema.`
        }
      }
    }

    return { valid: true }
  }

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a CSV file to import')
      return
    }

    setImporting(true)
    setResult(null)

    try {
      const text = await file.text()
      const rows = parseCSV(text)

      if (rows.length < 2) {
        toast.error('CSV file must contain headers and at least one data row')
        setImporting(false)
        return
      }

      const headers = rows[0]
      const dataRows = rows.slice(1)

      // Validate headers
      const headerValidation = validateHeaders(headers)
      if (!headerValidation.valid) {
        toast.error(headerValidation.message || 'Invalid CSV headers')
        setImporting(false)
        return
      }

      const supabase = createClient()
      const errors: { row: number; reason: string }[] = []
      let successCount = 0

      // Process each row
      for (let i = 0; i < dataRows.length; i++) {
        const rowData = dataRows[i]
        const rowNumber = i + 2 // +2 because row 1 is headers, and we're 0-indexed

        try {
          // Map row data to object
          const record: Record<string, string | number | null> = {}
          
          headers.forEach((header, index) => {
            const value = rowData[index]?.trim() || ''
            const normalizedHeader = header.trim().toLowerCase()
            
            // Handle numeric fields
            if (['age', 'no_of_children', 'year_completed'].includes(normalizedHeader)) {
              record[normalizedHeader] = value ? parseInt(value) : null
            } else {
              record[normalizedHeader] = value || null
            }
          })

          // Validate required fields
          if (!record.student_name || !record.gender) {
            errors.push({
              row: rowNumber,
              reason: 'Missing required fields: student_name and gender are mandatory'
            })
            continue
          }

          // Insert into Supabase
          const { error } = await supabase
            .from('student_profiles')
            .insert([record])

          if (error) {
            errors.push({
              row: rowNumber,
              reason: error.message
            })
          } else {
            successCount++
          }
        } catch (error) {
          errors.push({
            row: rowNumber,
            reason: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      setResult({
        totalRows: dataRows.length,
        successCount,
        failedCount: errors.length,
        errors
      })

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} student${successCount > 1 ? 's' : ''}`)
      }
      if (errors.length > 0) {
        toast.error(`${errors.length} row${errors.length > 1 ? 's' : ''} failed to import`)
      }

    } catch (error) {
      console.error('Import error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to import CSV file')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      {/* Header - Prominent and Clear */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-3">Import Students</h1>
        <div className="rounded-xl bg-yellow-500/20 p-5 ring-2 ring-yellow-500/50">
          <p className="text-base font-semibold text-yellow-100 leading-relaxed">
            Bulk import student profiles using <span className="font-bold text-yellow-50">CSV files only</span>. 
            Ensure column names <span className="font-bold text-yellow-50">exactly match</span> the database fields 
            (e.g., <code className="bg-yellow-900/30 px-2 py-0.5 rounded text-yellow-50">student_name</code>, 
            <code className="bg-yellow-900/30 px-2 py-0.5 rounded text-yellow-50">gender</code>, 
            <code className="bg-yellow-900/30 px-2 py-0.5 rounded text-yellow-50">province</code>, 
            <code className="bg-yellow-900/30 px-2 py-0.5 rounded text-yellow-50">district</code>).
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 rounded-xl bg-blue-500/10 p-5 ring-1 ring-blue-500/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <AlertCircle className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-blue-400 mb-2">Import Requirements</h3>
            <ul className="space-y-2 text-sm text-blue-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong>CSV files only</strong> - Excel files (.xls, .xlsx) are not accepted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong>Exact column names</strong> - Headers must match database fields exactly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong>Required fields</strong> - student_name and gender are mandatory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong>Download template</strong> - Use the template below for correct format</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Template Download */}
      <div className="mb-8 rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <Download className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">CSV Template</h3>
              <p className="text-sm text-gray-400">Download a template with all required columns</p>
            </div>
          </div>
          <button
            onClick={generateCSVTemplate}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors font-medium"
          >
            <Download className="h-5 w-5" />
            Download Template
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-8 rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
            <Upload className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Upload CSV File</h3>
            <p className="text-sm text-gray-400">Select a CSV file to import student profiles</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-500 file:text-white
                hover:file:bg-blue-400
                file:cursor-pointer cursor-pointer
                file:transition-colors"
            />
          </div>

          {file && (
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
              <FileText className="h-5 w-5 text-green-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={!file || importing}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {importing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Import Students
              </>
            )}
          </button>
        </div>
      </div>

      {/* Import Results */}
      {result && (
        <div className="rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Import Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg bg-blue-500/10 p-4 ring-1 ring-blue-500/20">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{result.totalRows}</p>
                  <p className="text-sm text-gray-400">Total Rows</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-green-500/10 p-4 ring-1 ring-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{result.successCount}</p>
                  <p className="text-sm text-gray-400">Successful</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-red-500/10 p-4 ring-1 ring-red-500/20">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{result.failedCount}</p>
                  <p className="text-sm text-gray-400">Failed</p>
                </div>
              </div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-red-400 mb-3">Failed Rows</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <div key={index} className="p-3 bg-red-500/10 rounded-lg ring-1 ring-red-500/20">
                    <p className="text-sm font-medium text-red-400">Row {error.row}</p>
                    <p className="text-xs text-red-300 mt-1">{error.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
