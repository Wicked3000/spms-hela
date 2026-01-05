import { createClient } from '@/lib/supabase/server'
import { UserRole, UserProfile } from '@/types/university'

/**
 * Get the current user's profile including role information
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Get the current user's role
 */
export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getUserProfile()
  return profile?.role || null
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'admin'
}

/**
 * Check if the current user is a university representative
 */
export async function isUniversity(): Promise<boolean> {
  const role = await getUserRole()
  const profile = await getUserProfile()
  return role === 'university' && profile?.is_active === true
}

/**
 * Check if the current user has access to view documents
 */
export async function canViewDocuments(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'admin' || role === 'university'
}

/**
 * Get all university users (admin only)
 */
export async function getUniversityUsers() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('role', 'university')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching university users:', error)
    return []
  }

  return data
}

/**
 * Create or update user profile with role
 */
export async function upsertUserProfile(userId: string, profileData: Partial<UserProfile>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error upserting user profile:', error)
    throw error
  }

  return data
}
