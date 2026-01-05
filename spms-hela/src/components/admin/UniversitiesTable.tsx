'use client'

import { useCallback, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Building2, 
  Mail, 
  Globe, 
  UserCheck, 
  UserX, 
  Edit2, 
  Save, 
  X,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: string
  university_name: string | null
  university_country: string | null
  is_active: boolean
  created_at: string
}

export default function UniversitiesTable() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})

  const supabase = createClient()

  const fetchUniversityProfiles = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'university')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase Error Details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        throw error
      }
      setProfiles(data || [])
    } catch (error: unknown) {
      console.error('Error fetching university profiles:', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to load university users: ${message}`)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchUniversityProfiles()
  }, [fetchUniversityProfiles])

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      
      setProfiles(profiles.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p))
      toast.success(currentStatus ? 'Access deactivated' : 'Access activated')
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleEdit = (profile: UserProfile) => {
    setEditingId(profile.id)
    setEditForm(profile)
  }

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          university_name: editForm.university_name,
          full_name: editForm.full_name,
          university_country: editForm.university_country
        })
        .eq('id', id)

      if (error) throw error
      
      setProfiles(profiles.map(p => p.id === id ? { ...p, ...editForm } : p))
      setEditingId(null)
      toast.success('University details updated')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save changes')
    }
  }

  // Direct creation is disabled as it requires manual Supabase Auth User creation first.

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">University Access Control</h2>
          <p className="text-sm text-gray-400">Manage which universities can view student documents</p>
        </div>
        <button 
          onClick={() => toast.info('Step 1: Create user in Supabase Auth Dashboard. Step 2: Their profile will appear here.')}
          className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20"
        >
          <Plus className="h-4 w-4" /> Add New University
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1E293B]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">University</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Building2 className="mx-auto h-12 w-12 opacity-20 mb-3" />
                    <p>No university users registered yet</p>
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      {editingId === profile.id ? (
                        <input 
                          type="text"
                          value={editForm.university_name || ''}
                          onChange={(e) => setEditForm({...editForm, university_name: e.target.value})}
                          className="bg-[#0F172A] border border-white/10 rounded px-2 py-1 text-white text-sm w-full"
                          placeholder="University Name"
                        />
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{profile.university_name || 'N/A'}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Globe className="h-3 w-3" /> {profile.university_country || 'Not specified'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === profile.id ? (
                        <input 
                          type="text"
                          value={editForm.full_name || ''}
                          onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                          className="bg-[#0F172A] border border-white/10 rounded px-2 py-1 text-white text-sm w-full"
                          placeholder="Rep Name"
                        />
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-300">{profile.full_name || 'N/A'}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1 lowercase">
                            <Mail className="h-3 w-3" /> {profile.email}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        profile.is_active 
                          ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20' 
                          : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                      }`}>
                        {profile.is_active ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {profile.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === profile.id ? (
                          <>
                            <button 
                              onClick={() => handleSave(profile.id)}
                              className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                              title="Save"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-gray-400 hover:bg-white/10 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleToggleStatus(profile.id, profile.is_active)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                profile.is_active 
                                  ? 'text-red-400 hover:bg-red-400/10' 
                                  : 'text-green-400 hover:bg-green-400/10'
                              }`}
                              title={profile.is_active ? 'Disable' : 'Enable'}
                            >
                              {profile.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </button>
                            <button 
                              onClick={() => handleEdit(profile)}
                              className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-blue-500/5 p-4 border border-blue-500/20">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-100/70">
            <p className="font-semibold text-blue-400 mb-1">Administrative Note:</p>
            <p>To register a new university, first create the user in the <strong>Supabase Dashboard</strong>. Once the user is created, their profile will automatically appear here. You can then activate their account and assign their university name.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
