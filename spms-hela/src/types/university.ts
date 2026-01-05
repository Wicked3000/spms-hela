// User role types for the application

export type UserRole = 'admin' | 'university' | 'public'

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  university_name: string | null
  university_country: string | null
  university_contact: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type StudentSelection = {
  id: number
  user_id: string
  student_id: number
  selected_at: string
  notes: string | null
  status: 'selected' | 'reviewing' | 'accepted' | 'rejected'
}

export type Notification = {
  id: number
  user_id: string
  type: 'student_selected' | 'selection_updated' | 'new_university_user' | 'general'
  title: string
  message: string
  data: Record<string, any> | null
  is_read: boolean
  created_at: string
}

export type StudentWithSelection = {
  id: number
  student_name: string
  gender: string
  province: string
  district: string
  stream: string
  tvet_trade: string | null
  selection: StudentSelection | null
  is_selected: boolean
}
