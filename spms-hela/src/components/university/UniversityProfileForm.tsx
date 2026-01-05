'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Building2, 
  Mail, 
  User, 
  MapPin, 
  Phone, 
  ShieldCheck,
  Save,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  university_name: string | null
  university_country: string | null
  university_contact: string | null
}

export default function UniversityProfileForm({ initialProfile }: { initialProfile: UserProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          university_name: profile.university_name,
          university_country: profile.university_country,
          university_contact: profile.university_contact,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (error) throw error
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#1E293B] p-8 border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-green-400" /> Representative Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    aria-label="Full Name"
                    className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-[#0F172A]/50 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-2 text-[10px] text-gray-500 italic">Contact admin to change your primary login email.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Institution Info */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#1E293B] p-8 border border-white/10 shadow-xl">
             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-400" /> Institution Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">University Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={profile.university_name || ''}
                    onChange={(e) => setProfile({ ...profile, university_name: e.target.value })}
                    className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                    placeholder="Official Institution Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Country</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={profile.university_country || ''}
                      onChange={(e) => setProfile({ ...profile, university_country: e.target.value })}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                      placeholder="Country"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Contact Link</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={profile.university_contact || ''}
                      onChange={(e) => setProfile({ ...profile, university_contact: e.target.value })}
                      className="w-full bg-[#0F172A] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                      placeholder="Website or Phone"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-3 rounded-2xl bg-green-500 px-10 py-4 text-sm font-black text-white hover:bg-green-400 transition-all shadow-xl shadow-green-500/20 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Update Selection Credentials
        </button>
      </div>

      <div className="rounded-3xl bg-green-500/5 p-6 border border-green-500/10 flex items-center gap-4">
        <ShieldCheck className="h-6 w-6 text-green-400 flex-shrink-0" />
        <p className="text-sm text-green-100/60 font-medium">
          These details are verified by the Hela Education Division. Updating your profile helps students identify which institutions are interested in their profiles.
        </p>
      </div>
    </form>
  )
}
