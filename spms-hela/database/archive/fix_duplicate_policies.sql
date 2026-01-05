/*
 * Fix for Supabase Performance Advisor Warnings
 * 
 * Issue: "Multiple Permissive Policies" detected on student_profiles (7x) and helpful_resources (1x).
 * Cause: Duplicate policies accumulated during development.
 * Fix: Drops ALL existing policies on these tables and re-creates single, clean policies.
 *
 * INSTRUCTIONS:
 * 1. Go to Supabase Dashboard -> SQL Editor
 * 2. Copy and Paste the content of this file
 * 3. Click "Run"
 */

BEGIN;

--------------------------------------------------------------------------------
-- 1. Fix 'student_profiles' (Removes 7 duplicate warnings)
--------------------------------------------------------------------------------

-- Drop all existing policies dynamically to ensure clean slate
DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'student_profiles') LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON student_profiles', r.policyname); 
    END LOOP; 
END $$;

-- Verify RLS is on
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- Re-create Policy 1: Public Read Access
-- Allows everyone (anon + auth) to read profiles
CREATE POLICY "public_view_profiles" 
ON student_profiles FOR SELECT 
TO public 
USING (true);

-- Re-create Policy 2: Admin Full Management
-- Allows authenticated users (admins) to insert/update/delete/select
CREATE POLICY "admin_all_access" 
ON student_profiles FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


--------------------------------------------------------------------------------
-- 2. Fix 'helpful_resources' (Removes 1 duplicate warning)
--------------------------------------------------------------------------------

-- Drop all existing policies dynamically
DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'helpful_resources') LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON helpful_resources', r.policyname); 
    END LOOP; 
END $$;

-- Verify RLS is on
ALTER TABLE helpful_resources ENABLE ROW LEVEL SECURITY;

-- Re-create Policy 1: Public Read Access
CREATE POLICY "public_view_resources" 
ON helpful_resources FOR SELECT 
TO public 
USING (true);

-- Re-create Policy 2: Admin Full Management
CREATE POLICY "admin_resources_access" 
ON helpful_resources FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

COMMIT;
