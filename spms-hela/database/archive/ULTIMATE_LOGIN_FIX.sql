-- ULTIMATE FIX FOR UNIVERSITY LOGIN
-- This script fixes RLS recursion, sets up the table correctly, and adds your user profile.

-- 1. CLEAN UP POLICIES (Fixes Recursion)
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- 2. CREATE NON-RECURSIVE POLICIES
-- Simple policy: Users see themselves
CREATE POLICY "Users can view their own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Admin policy (Checking role string WITHOUT a subquery to avoid recursion)
-- This assumes the JWT contains the role, but for now we'll use a safer direct check
CREATE POLICY "Admins can view everything"
ON user_profiles FOR SELECT
TO authenticated
USING (
  (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
);
-- Wait, actually the above is still a subquery. 
-- The SAFEST way in Supabase to check admin without recursion:
CREATE OR REPLACE FUNCTION public.is_admin_check() 
RETURNS boolean stable language sql security definer AS $$
  SELECT EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin');
$$;

DROP POLICY IF EXISTS "Admins can view everything" ON user_profiles;
CREATE POLICY "Admins can view all" ON user_profiles FOR SELECT USING (public.is_admin_check());

CREATE POLICY "Users can update self" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = id);

-- 3. ENSURE YOUR PROFILE EXISTS
-- Replace the email and UUID if you know them, or run this to auto-add from auth.users
INSERT INTO user_profiles (id, email, full_name, role, university_name, is_active)
SELECT 
  id, 
  email, 
  'University Representative', 
  'university', 
  'Test University', 
  true
FROM auth.users
WHERE email = 'PASTE_YOUR_EMAIL_HERE' -- ⚠️ CHANGE THIS
ON CONFLICT (id) DO UPDATE 
SET role = 'university', is_active = true;

-- 4. VERIFY EVERYTHING
SELECT 'Current Auth User Count' as check, count(*) from auth.users;
SELECT 'Current Profile Count' as check, count(*) from user_profiles;
SELECT email, role, is_active FROM user_profiles;
