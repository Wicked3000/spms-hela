-- DEBUGGING SCRIPT: Run this in Supabase SQL Editor
-- This will help us find the issue with university user login

-- ============================================================================
-- STEP 1: Check if user_profiles table exists
-- ============================================================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles';
-- Expected: Should return 'user_profiles'
-- If empty: The table wasn't created, go back and run UNIVERSITY_ACCESS_SETUP.sql


-- ============================================================================
-- STEP 2: Check all auth users
-- ============================================================================
SELECT id, email, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
-- This shows your auth users and their UUIDs


-- ============================================================================
-- STEP 3: Check all user profiles
-- ============================================================================
SELECT id, email, role, university_name, is_active
FROM user_profiles
ORDER BY created_at DESC;
-- This shows which users have profiles


-- ============================================================================
-- STEP 4: Find users WITHOUT profiles (the problem!)
-- ============================================================================
SELECT 
  u.id as auth_user_id,
  u.email as auth_email,
  p.id as profile_id,
  p.role as profile_role
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE p.id IS NULL;
-- These are users who CAN login but DON'T have a profile
-- This is likely your issue!


-- ============================================================================
-- STEP 5: QUICK FIX - Create profile for your auth user
-- ============================================================================
-- Replace 'your-email@example.com' with the email you're trying to login with
-- This will auto-create the profile

INSERT INTO user_profiles (id, email, full_name, role, university_name, is_active)
SELECT 
  id,
  email,
  'University Representative',
  'university',
  'Test University',
  true
FROM auth.users
WHERE email = 'your-email@example.com'  -- ⚠️ CHANGE THIS TO YOUR EMAIL
ON CONFLICT (id) DO UPDATE
SET role = 'university',
    university_name = 'Test University',
    is_active = true;

-- After running this, try logging in again!


-- ============================================================================
-- STEP 6: Verify the fix worked
-- ============================================================================
SELECT 
  u.email,
  p.role,
  p.university_name,
  p.is_active
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'your-email@example.com';  -- ⚠️ CHANGE THIS
-- Should show: role = 'university', is_active = true
