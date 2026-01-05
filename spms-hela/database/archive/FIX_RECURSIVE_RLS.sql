-- FIX: Remove recursive RLS policies that cause login failures
-- Run this in Supabase SQL Editor

-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

-- 2. Create non-recursive policies
-- Use auth.uid() directly for individual access
CREATE POLICY "Users can view their own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

-- Use a SECURITY DEFINER function to check admin status (avoiding recursion)
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies using the function
CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
USING (public.check_is_admin());

CREATE POLICY "Admins can insert profiles"
ON user_profiles FOR INSERT
WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can update all profiles"
ON user_profiles FOR UPDATE
USING (public.check_is_admin());

-- 3. Update update policy for regular users
CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id);

-- 4. Verify policies
SELECT policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'user_profiles';
