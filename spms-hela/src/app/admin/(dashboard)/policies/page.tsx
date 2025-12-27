'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, Shield, Loader2, Trash2, Eye, EyeOff, Plus, Edit2, FileText } from 'lucide-react'

type PolicyDocument = {
  id: number
  title: string
  description: string | null
  policy_type: string
  last_updated: string
  page_count: number | null
  file_size: string | null
  file_url: string
  status: 'Active' | 'Archived'
  created_at: string
}

const POLICY_TYPES = ['FODE Policy', 'TVET Policy', 'Provincial Policy', 'National Policy', 'Other']

export default function PolicyDocumentsManagementPage() {
  const [policies, setPolicies] = useState<PolicyDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<PolicyDocument | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    policy_type: '',
    description: '',
    last_updated: new Date().toISOString().split('T')[0],
    page_count: '',
    file_size: '',
    status: 'Active' as 'Active' | 'Archived'
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('policy_documents')
        .select('*')
        .order('last_updated', { ascending: false })

      if (error) {
        if (error.message.includes('relation') || error.code === '42P01') {
          toast.error('Policy documents table not set up. Please run the SQL setup from policy_documents_setup.sql')
          setPolicies([])
          setLoading(false)
          return
        }
        throw error
      }
      
      setPolicies(data || [])
    } catch (error) {
      console.error('Error fetching policies:', error)
      toast.error('Failed to load policy documents')
      setPolicies([])
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

    // Calculate file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1)
    setFormData(prev => ({ ...prev, file_size: `${sizeInMB} MB` }))
    setSelectedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingPolicy && !selectedFile) {
      toast.error('Please select a PDF file')
      return
    }

    if (!formData.title || !formData.policy_type || !formData.last_updated) {
      toast.error('Please fill in all required fields')
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let fileUrl = editingPolicy?.file_url || ''

      // Upload file if new file selected
      if (selectedFile) {
        const fileName = `${Date.now()}_${selectedFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('official_documents')
          .upload(fileName, selectedFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('official_documents')
          .getPublicUrl(fileName)

        fileUrl = publicUrl
      }

      const policyData = {
        title: formData.title,
        policy_type: formData.policy_type,
        description: formData.description || null,
        last_updated: formData.last_updated,
        page_count: formData.page_count ? parseInt(formData.page_count) : null,
        file_size: formData.file_size || null,
        status: formData.status,
        file_url: fileUrl
      }

      if (editingPolicy) {
        // Update existing policy
        const { error: updateError } = await supabase
          .from('policy_documents')
          .update(policyData)
          .eq('id', editingPolicy.id)

        if (updateError) throw updateError
        toast.success('Policy document updated successfully!')
      } else {
        // Insert new policy
        const { error: insertError } = await supabase
          .from('policy_documents')
          .insert([policyData])

        if (insertError) throw insertError
        toast.success('Policy document uploaded successfully!')
      }
      
      // Reset form
      setFormData({
        title: '',
        policy_type: '',
        description: '',
        last_updated: new Date().toISOString().split('T')[0],
        page_count: '',
        file_size: '',
        status: 'Active'
      })
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setShowForm(false)
      setEditingPolicy(null)

      // Refresh policies
      fetchPolicies()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save policy document')
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (policy: PolicyDocument) => {
    setEditingPolicy(policy)
    setFormData({
      title: policy.title,
      policy_type: policy.policy_type,
      description: policy.description || '',
      last_updated: policy.last_updated,
      page_count: policy.page_count?.toString() || '',
      file_size: policy.file_size || '',
      status: policy.status
    })
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingPolicy(null)
    setFormData({
      title: '',
      policy_type: '',
      description: '',
      last_updated: new Date().toISOString().split('T')[0],
      page_count: '',
      file_size: '',
      status: 'Active'
    })
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setShowForm(false)
  }

  const handleDelete = async (id: number, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this policy document?')) return

    try {
      const supabase = createClient()

      // Extract file path from URL
      const urlParts = fileUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]

      // Delete from storage
      await supabase.storage
        .from('official_documents')
        .remove([fileName])

      // Delete from database
      const { error } = await supabase
        .from('policy_documents')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Policy document deleted successfully')
      fetchPolicies()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete policy document')
    }
  }

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const supabase = createClient()
      const newStatus = currentStatus === 'Active' ? 'Archived' : 'Active'

      const { error } = await supabase
        .from('policy_documents')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      toast.success(`Policy ${newStatus === 'Active' ? 'activated' : 'archived'}`)
      fetchPolicies()
    } catch (error) {
      console.error('Status toggle error:', error)
      toast.error('Failed to update status')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Manage Policy Documents</h1>
        <p className="mt-2 text-sm text-gray-400">
          Upload and manage official policy documents for the Publications page
        </p>
      </div>

      {/* Upload Form Toggle */}
      <div className="mb-6">
        <button
          onClick={() => {
            if (showForm && editingPolicy) {
              handleCancelEdit()
            } else {
              setShowForm(!showForm)
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          {showForm ? 'Hide Form' : 'Add New Policy Document'}
        </button>
      </div>

      {/* Upload/Edit Form */}
      {showForm && (
        <div className="mb-8 rounded-xl bg-[#0F172A] p-6 ring-1 ring-white/10">
          <h2 className="text-lg font-semibold text-white mb-6">
            {editingPolicy ? 'Edit Policy Document' : 'Add New Policy Document'}
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
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="Policy document title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Policy Type <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.policy_type}
                  onChange={(e) => setFormData({ ...formData, policy_type: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-yellow-500 focus:outline-none"
                >
                  <option value="">Select policy type</option>
                  {POLICY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
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
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="Brief description of the policy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Updated <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.last_updated}
                  onChange={(e) => setFormData({ ...formData, last_updated: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-yellow-500 focus:outline-none"
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
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="Number of pages"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Archived' })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-yellow-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  PDF File {!editingPolicy && <span className="text-red-400">*</span>}
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
                    file:bg-yellow-500 file:text-white
                    hover:file:bg-yellow-400
                    file:cursor-pointer cursor-pointer
                    file:transition-colors"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-green-400">
                    Selected: {selectedFile.name} ({formData.file_size})
                  </p>
                )}
                {editingPolicy && !selectedFile && (
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {editingPolicy ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    {editingPolicy ? 'Update Policy' : 'Upload Policy'}
                  </>
                )}
              </button>
              {editingPolicy && (
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

      {/* Policies List */}
      <div className="rounded-xl bg-[#0F172A] ring-1 ring-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">All Policy Documents ({policies.length})</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mx-auto" />
            <p className="mt-4 text-sm text-gray-400">Loading policy documents...</p>
          </div>
        ) : policies.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="h-12 w-12 text-gray-600 mx-auto" />
            <p className="mt-4 text-sm text-gray-400">No policy documents uploaded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-[#1E293B]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Policy Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Pages</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm text-white">{policy.title}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs text-yellow-400 ring-1 ring-yellow-500/20">
                        {policy.policy_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(policy.last_updated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{policy.page_count || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ring-1 ${
                        policy.status === 'Active' 
                          ? 'bg-green-500/10 text-green-400 ring-green-500/20' 
                          : 'bg-gray-500/10 text-gray-400 ring-gray-500/20'
                      }`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(policy)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(policy.id, policy.status)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title={policy.status === 'Active' ? 'Archive' : 'Activate'}
                        >
                          {policy.status === 'Active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <a
                          href={policy.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="View"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(policy.id, policy.file_url)}
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
