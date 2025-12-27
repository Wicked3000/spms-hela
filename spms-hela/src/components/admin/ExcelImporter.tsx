
'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */


import { useState } from 'react'
import * as XLSX from 'xlsx'
import { createClient } from '../../lib/supabase/client'
import { Loader2, Upload, AlertCircle } from 'lucide-react'

export default function ExcelImporter() {
  const [data, setData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClient()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 })
        
        if (jsonData.length > 0) {
           const headerRow = jsonData[0] as string[]
           const dataRows = jsonData.slice(1)
           
           // Simple mapping: assume headers match DB columns loosely or just display them
           const formattedData = dataRows.map((row: any) => {
               const obj: any = {}
               headerRow.forEach((key, index) => {
                   obj[key] = row[index]
               })
               return obj
           }).filter((row: any) => Object.values(row).some(x => x !== undefined)) // Filter empty

           setHeaders(headerRow)
           setData(formattedData)
           setError(null)
        }
      } catch (err) {
        setError('Failed to parse Excel file.')
        console.error(err)
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleImport = async () => {
      setLoading(true)
      setError(null)
      setSuccess(null)

      try {
          // This assumes the Excel columns MATCH the DB columns exactly
          // You might need a mapping step here if they differ
          const { error } = await supabase
            .from('student_profiles')
            .insert(data)

          if (error) throw error

          setSuccess(`Successfully imported ${data.length} students.`)
          setData([])
          setHeaders([])
      } catch (err: any) {
          setError('Import failed: ' + err.message)
      } finally {
          setLoading(false)
      }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <label htmlFor="file-upload" className="block text-sm font-medium leading-6 text-slate-900">
            Upload Excel File (.xlsx)
        </label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10">
            <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-slate-600">
                    <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-slate-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-600 focus-within:ring-offset-2 hover:text-slate-500"
                    >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-slate-600">XLSX up to 10MB</p>
            </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
          <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-md text-sm">
              {success}
          </div>
      )}

      {data.length > 0 && (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-slate-900">Preview ({data.length} records)</h3>
                <button
                    onClick={handleImport}
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Import Data'}
                </button>
            </div>
            <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            {headers.map((header) => (
                                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {data.slice(0, 5).map((row, i) => ( // Show first 5
                            <tr key={i}>
                                {headers.map((header) => (
                                    <td key={`${i}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length > 5 && (
                    <div className="px-6 py-3 text-sm text-slate-500 bg-slate-50 border-t">
                        ... and {data.length - 5} more rows
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  )
}
