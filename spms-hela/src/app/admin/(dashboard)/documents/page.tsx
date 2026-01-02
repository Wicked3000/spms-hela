
import { createClient } from '@/lib/supabase/server'
import { Download, Trash2 } from 'lucide-react'

export default async function DocumentsPage() {
  const supabase = await createClient()

  // List files in the 'student_documents' bucket
  // This requires the bucket to exist
  const { data: files, error } = await supabase
    .storage
    .from('student_documents')
    .list(undefined, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })

  return (
    <div>
       <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Documents</h1>
          <p className="mt-2 text-sm text-slate-700">
            Manage uploaded student certificates and transcripts.
          </p>
        </div>
      </div>

       <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
             <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-slate-300">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Size</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Type</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {error || !files || files.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-4 text-center text-sm text-slate-500">
                                {error ? 'Error accessing storage bucket (ensure "student_documents" bucket exists).' : 'No files found.'}
                            </td>
                        </tr>
                    ) : (
                        files.map((file) => (
                            <tr key={file.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">{file.name}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{(file.metadata?.size / 1024).toFixed(2)} KB</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{file.metadata?.mimetype}</td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <button aria-label="Download document" className="text-slate-600 hover:text-slate-900 mr-4"><Download className="h-4 w-4" /></button>
                                     <button aria-label="Delete document" className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                                </td>
                            </tr>
                        ))
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
       </div>
    </div>
  )
}
