-- University Access System Setup
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- 1. CREATE USER PROFILES TABLE WITH ROLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'public' CHECK (role IN ('admin', 'university', 'public')),
  university_name TEXT, -- Only for university users
  university_country TEXT,
  university_contact TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can insert profiles"
ON user_profiles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can update all profiles"
ON user_profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- 2. CREATE STUDENT SELECTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS student_selections (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  selected_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  status TEXT DEFAULT 'selected' CHECK (status IN ('selected', 'reviewing', 'accepted', 'rejected')),
  UNIQUE(user_id, student_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_selections_user ON student_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_selections_student ON student_selections(student_id);
CREATE INDEX IF NOT EXISTS idx_selections_status ON student_selections(status);

-- Enable RLS
ALTER TABLE student_selections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_selections
CREATE POLICY "Users can view their own selections"
ON student_selections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "University users can insert selections"
ON student_selections FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'university' AND is_active = true
  )
);

CREATE POLICY "Users can update their own selections"
ON student_selections FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own selections"
ON student_selections FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all selections"
ON student_selections FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- 3. CREATE NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('student_selected', 'selection_updated', 'new_university_user', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Store additional data like student_id, university_id, etc.
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================================================
-- 4. CREATE FUNCTION TO NOTIFY ADMINS WHEN STUDENT IS SELECTED
-- ============================================================================

CREATE OR REPLACE FUNCTION notify_admins_on_selection()
RETURNS TRIGGER AS $$
DECLARE
  admin_user RECORD;
  student_name TEXT;
  university_name TEXT;
BEGIN
  -- Get student name
  SELECT student_name INTO student_name
  FROM student_profiles
  WHERE id = NEW.student_id;

  -- Get university name
  SELECT university_name INTO university_name
  FROM user_profiles
  WHERE id = NEW.user_id;

  -- Create notification for all admins
  FOR admin_user IN
    SELECT id FROM user_profiles WHERE role = 'admin' AND is_active = true
  LOOP
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      admin_user.id,
      'student_selected',
      'Student Selected by University',
      university_name || ' has selected ' || student_name || ' for review.',
      jsonb_build_object(
        'student_id', NEW.student_id,
        'university_user_id', NEW.user_id,
        'selection_id', NEW.id
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS notify_admins_trigger ON student_selections;
CREATE TRIGGER notify_admins_trigger
AFTER INSERT ON student_selections
FOR EACH ROW
EXECUTE FUNCTION notify_admins_on_selection();

-- ============================================================================
-- 5. UPDATE STORAGE POLICIES FOR UNIVERSITY ACCESS
-- ============================================================================

-- Allow university users to view student documents
CREATE POLICY "University users can view student documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student_documents' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'university' AND is_active = true
  )
);

-- ============================================================================
-- 6. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role FROM user_profiles WHERE id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if user is university
CREATE OR REPLACE FUNCTION is_university()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'university' AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================================
-- 7. INSERT SAMPLE UNIVERSITY USER (OPTIONAL - FOR TESTING)
-- ============================================================================

-- Note: You'll need to create the auth user first in Supabase Auth UI,
-- then insert a profile here with their UUID

-- Example:
-- INSERT INTO user_profiles (id, email, full_name, role, university_name, university_country)
-- VALUES (
--   'YOUR_AUTH_USER_UUID_HERE',
--   'university@example.com',
--   'University Representative',
--   'university',
--   'University of Papua New Guinea',
--   'Papua New Guinea'
-- );

-- ============================================================================
-- 8. VERIFICATION QUERIES
-- ============================================================================

-- Check if tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'student_selections', 'notifications');

-- Count existing user profiles
SELECT COUNT(*) as profile_count FROM user_profiles;

-- View all roles
SELECT email, role, university_name, is_active FROM user_profiles;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
