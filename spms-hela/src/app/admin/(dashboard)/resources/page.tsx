'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, FileText, Loader2, Trash2, Eye, EyeOff, Plus, Edit2 } from 'lucide-react'

type HelpfulResource = {
  id: number
  title: string
  description: string | null
  category: string
  download_count: number
  file_url: string
  status: 'Active' | 'Archived'
  created_at: string
}

const CATEGORIES = ['Forms', 'Guidelines', 'Career Resources', 'Other']

export default function HelpfulResourcesManagementPage() {
  const [resources, setResources] = useState<HelpfulResource[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingResource, setEditingResource] = useState<HelpfulResource | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    status: 'Active' as 'Active' | 'Archived'
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('helpful_resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.message.includes('relation') || error.code === '42P01') {
          toast.error('Helpful resources table not set up. Please run the SQL setup from helpful_resources_setup.sql')
          setResources([])
          setLoading(false)
          return
        }
        throw error
      }
      
      setResources(data || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast.error('Failed to load resources')
      setResources([])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingResource && !selectedFile) {
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let fileUrl = editingResource?.file_url || ''

      // Upload file if new file selected
      if (selectedFile) {
        const fileName = `${Date.now()}_${selectedFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('helpful_materials')
          .upload(fileName, selectedFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('helpful_materials')
          .getPublicUrl(fileName)

        fileUrl = publicUrl
      }

      if (editingResource) {
        // Update existing resource
        const { error: updateError } = await supabase
          .from('helpful_resources')
          .update({
            title: formData.title,
            category: formData.category,
            description: formData.description || null,
            status: formData.status,
            file_url: fileUrl
          })
          .eq('id', editingResource.id)

        if (updateError) throw updateError
        toast.success('Resource updated successfully!')
      } else {
        // Insert new resource
        const { error: insertError } = await supabase
          .from('helpful_resources')
          .insert([{
            title: formData.title,
            category: formData.category,
            description: formData.description || null,
            file_url: fileUrl,
            status: formData.status,
            download_count: 0
          }])

        if (insertError) throw insertError
        toast.success('Resource uploaded successfully!')
      }
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        status: 'Active'
      })
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setShowForm(false)
      setEditingResource(null)

      // Refresh resources
      fetchResources()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save resource')
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (resource: HelpfulResource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      category: resource.category,
      description: resource.description || '',
      status: resource.status
    })
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingResource(null)
    setFormData({
      title: '',
      category: '',
      description: '',
      status: 'Active'
    })
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setShowForm(false)
  }

  const handleDelete = async (id: number, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const supabase = createClient()

      // Extract file path from URL
      const urlParts = fileUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // Delete from storage
      await supabase.storage
        .from('helpful_materials')
        .remove([fileName])

      // Delete from database
      const { error } = await supabase
        .from('helpful_resources')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Resource deleted successfully')
      fetchResources()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete resource')
    }
  }

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const supabase = createClient()
      const newStatus = currentStatus === 'Active' ? 'Archived' : 'Active'

      const { error } = await supabase
        .from('helpful_resources')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      toast.success(`Resource ${newStatus === 'Active' ? 'activated' : 'archived'}`)
      fetchResources()
    } catch (error) {
      console.error('Status toggle error:', error)
      toast.error('Failed to update status')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Manage Helpful Resources</h1>
        <p className="mt-2 text-sm text-gray-400">
          Upload and manage downloadable resources for the Publications page
        </p>
      </div>

      {/* Upload Form Toggle */}
      <div className="mb-6">
        <button
          onClick={() => {
            if (showForm && editingResource) {
              handleCancelEdit()
            } else {
              setShowForm(!showForm)
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          {showForm ? 'Hide Form' : 'Add New Resource'}
        </button>
      </div>

      {/* Upload/Edit Form */}
      {showForm && (
        <div className="mb-8 rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
          <h2 className="text-lg font-semibold text-white mb-6">
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Resource title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
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
                  placeholder="Brief description of the resource"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
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
                  PDF File {!editingResource && <span className="text-red-400">*</span>}
                </label>
                <input
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
                {editingResource && !selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Leave empty to keep current file
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
                    {editingResource ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    {editingResource ? 'Update Resource' : 'Upload Resource'}
                  </>
                )}
              </button>
              {editingResource && (
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

      {/* Resources List */}
      <div className="rounded-xl bg-[#0F172A] ring-1 ring-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">All Resources ({resources.length})</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto" />
            <p className="mt-4 text-sm text-gray-400">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-600 mx-auto" />
            <p className="mt-4 text-sm text-gray-400">No resources uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-[#1E293B]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Downloads</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-white">{resource.title}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-400 ring-1 ring-blue-500/20">
                        {resource.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{resource.download_count}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ring-1 ${
                        resource.status === 'Active' 
                          ? 'bg-green-500/10 text-green-400 ring-green-500/20' 
                          : 'bg-gray-500/10 text-gray-400 ring-gray-500/20'
                      }`}>
                        {resource.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(resource.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(resource)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(resource.id, resource.status)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title={resource.status === 'Active' ? 'Archive' : 'Activate'}
                        >
                          {resource.status === 'Active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-400 hover:text-green-300 transition-colors"
                          title="View"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(resource.id, resource.file_url)}
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
