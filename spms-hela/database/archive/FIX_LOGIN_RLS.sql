-- FIX: Add missing RLS policy for post-login profile check
-- Run this in Supabase SQL Editor to fix the "User profile not found" error

-- This policy allows newly authenticated users to immediately read their profile
-- The existing policy only works AFTER the profile exists and session is refreshed

DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON user_profiles;

CREATE POLICY "Authenticated users can view their own profile"
ON user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_profiles' AND cmd = 'SELECT';
