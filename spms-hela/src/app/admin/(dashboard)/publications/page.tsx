'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, FileText, Loader2, Trash2, Eye, EyeOff, Plus } from 'lucide-react'

type PublishedDocument = {
  id: number
  title: string
  category: string
  description: string | null
  uploaded_by: string
  uploaded_at: string
  file_url: string
  file_size: string | null
  page_count: number | null
  status: 'Active' | 'Archived'
  is_featured: boolean
  published_month: string | null
  published_year: string | null
}

const CATEGORIES = ['Guide', 'Handbook', 'Report', 'Policy', 'Success Stories', 'Annual Report', 'Resource']

export default function PublicationsManagementPage() {
  const [documents, setDocuments] = useState<PublishedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    page_count: '',
    status: 'Active' as 'Active' | 'Archived',
    is_featured: false,
    published_month: '',
    published_year: new Date().getFullYear().toString()
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('published_documents')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) {
        // Check if table doesn't exist
        if (error.message.includes('relation') || error.code === '42P01') {
          toast.error('Publications table not set up. Please run the SQL setup from PUBLICATIONS_SUPABASE_SETUP.md')
          setDocuments([])
          setLoading(false)
          return
        }
        throw error
      }
      
      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast.error('Failed to load documents')
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error('Please select a PDF file')
      return
    }

    if (!formData.title || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upload file to storage
      const fileName = `${Date.now()}_${selectedFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('publications_files')
        .upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('publications_files')
        .getPublicUrl(fileName)

      // Calculate file size
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2)

      // Insert document metadata
      const { error: insertError } = await supabase
        .from('published_documents')
        .insert([{
          title: formData.title,
          category: formData.category,
          description: formData.description || null,
          uploaded_by: user.email || 'Admin',
          file_url: publicUrl,
          file_size: `${fileSizeMB} MB`,
          page_count: formData.page_count ? parseInt(formData.page_count) : null,
          status: formData.status,
          is_featured: formData.is_featured,
          published_month: formData.published_month || null,
          published_year: formData.published_year || null
        }])

      if (insertError) throw insertError

      toast.success('Document uploaded successfully!')
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        page_count: '',
        status: 'Active',
        is_featured: false,
        published_month: '',
        published_year: new Date().getFullYear().toString()
      })
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setShowForm(false)

      // Refresh documents
      fetchDocuments()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const supabase = createClient()

      // Extract file path from URL
      const urlParts = fileUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // Delete from storage
      await supabase.storage
        .from('publications_files')
        .remove([fileName])

      // Delete from database
      const { error } = await supabase
        .from('published_documents')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Document deleted successfully')
      fetchDocuments()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete document')
    }
  }

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const supabase = createClient()
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('You must be logged in to perform this action')
        return
      }

      const newStatus = currentStatus === 'Active' ? 'Archived' : 'Active'

      const { error } = await supabase
        .from('published_documents')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        // Log full error details
        console.error('Full RLS Policy Error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        // Check if it's a permissions error
        if (error.message.includes('permission') || error.message.includes('policy') || error.code === '42501') {
          toast.error(`Permission denied: ${error.message}. Check console for details.`)
          return
        }
        throw error
      }

      toast.success(`Document ${newStatus === 'Active' ? 'activated' : 'archived'}`)
      fetchDocuments()
    } catch (error) {
      console.error('Status toggle error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status'
      toast.error(`Failed to update status: ${errorMessage}`)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Manage Publications</h1>
        <p className="mt-2 text-sm text-gray-400">
          Upload and manage documents for the Publications page
        </p>
      </div>

      {/* Upload Form Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          {showForm ? 'Hide Upload Form' : 'Upload New Document'}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="mb-8 rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
          <h2 className="text-lg font-semibold text-white mb-6">Upload New Document</h2>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Document title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  aria-label="Select category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
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
                  placeholder="Brief description of the document"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Page Count
                </label>
                <input
                  type="number"
                  value={formData.page_count}
                  onChange={(e) => setFormData({ ...formData, page_count: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Number of pages"
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Published Month
                </label>
                <select
                  aria-label="Select published month"
                  value={formData.published_month}
                  onChange={(e) => setFormData({ ...formData, published_month: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select month</option>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Published Year
                </label>
                <input
                  type="text"
                  value={formData.published_year}
                  onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  placeholder="2024"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 rounded border-white/10 bg-[#1E293B] text-green-500 focus:ring-green-500 focus:ring-offset-0"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-300">Mark as Featured Publication</span>
                    <p className="text-xs text-gray-500">Featured publications appear in the &ldquo;Featured Publications&rdquo; section on the public page</p>
                  </div>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  PDF File <span className="text-red-400">*</span>
                </label>
                <input
                  aria-label="Upload PDF file"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
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
                {selectedFile && (
                  <p className="mt-2 text-sm text-green-400">
                    Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Upload Document
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documents List */}
      <div className="rounded-xl bg-[#0F172A] ring-1 ring-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Uploaded Documents ({documents.length})</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto" />
            <p className="mt-4 text-sm text-gray-400">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-600 mx-auto" />
            <p className="mt-4 text-sm text-gray-400">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-[#1E293B]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Pages</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Uploaded</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-white">{doc.title}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-400 ring-1 ring-blue-500/20">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{doc.page_count || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{doc.file_size || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ring-1 ${
                        doc.status === 'Active' 
                          ? 'bg-green-500/10 text-green-400 ring-green-500/20' 
                          : 'bg-gray-500/10 text-gray-400 ring-gray-500/20'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(doc.id, doc.status)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title={doc.status === 'Active' ? 'Archive' : 'Activate'}
                        >
                          {doc.status === 'Active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          title="View"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id, doc.file_url)}
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
