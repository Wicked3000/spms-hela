-- ============================================
-- SUPABASE SECURITY FIX SCRIPT
-- Run this in Supabase SQL Editor to resolve security issues
-- ============================================

-- STEP 1: Check current RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- STEP 2: Enable RLS on all public tables
ALTER TABLE IF EXISTS student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS published_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS curriculum_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS helpful_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS policy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;

-- STEP 3: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON student_profiles;
DROP POLICY IF EXISTS "Admins can manage student profiles" ON student_profiles;
DROP POLICY IF EXISTS "Public can view active documents" ON published_documents;
DROP POLICY IF EXISTS "Admins can insert documents" ON published_documents;
DROP POLICY IF EXISTS "Admins can update documents" ON published_documents;
DROP POLICY IF EXISTS "Admins can delete documents" ON published_documents;

-- STEP 4: Create policies for student_profiles
-- Allow public read access (required for public profile viewing)
CREATE POLICY "Public profiles are viewable by everyone" 
ON student_profiles 
FOR SELECT 
USING (true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Admins can manage student profiles" 
ON student_profiles 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- STEP 5: Create policies for published_documents
CREATE POLICY "Public can view active documents"
ON published_documents
FOR SELECT
USING (status = 'Active');

CREATE POLICY "Admins can insert documents"
ON published_documents
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update documents"
ON published_documents
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can delete documents"
ON published_documents
FOR DELETE
TO authenticated
USING (true);

-- STEP 6: Create policies for curriculum_programs (if exists)
DROP POLICY IF EXISTS "Public can view curriculum programs" ON curriculum_programs;
DROP POLICY IF EXISTS "Admins can manage curriculum programs" ON curriculum_programs;

CREATE POLICY "Public can view curriculum programs"
ON curriculum_programs
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage curriculum programs"
ON curriculum_programs
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- STEP 7: Create policies for helpful_resources (if exists)
DROP POLICY IF EXISTS "Public can view resources" ON helpful_resources;
DROP POLICY IF EXISTS "Admins can manage resources" ON helpful_resources;

CREATE POLICY "Public can view resources"
ON helpful_resources
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage resources"
ON helpful_resources
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- STEP 8: Create policies for policy_documents (if exists)
DROP POLICY IF EXISTS "Public can view policy documents" ON policy_documents;
DROP POLICY IF EXISTS "Admins can manage policy documents" ON policy_documents;

CREATE POLICY "Public can view policy documents"
ON policy_documents
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage policy documents"
ON policy_documents
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- STEP 9: Create policies for messages (if exists)
DROP POLICY IF EXISTS "Admins can view messages" ON messages;
DROP POLICY IF EXISTS "Admins can manage messages" ON messages;

CREATE POLICY "Admins can view messages"
ON messages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage messages"
ON messages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- STEP 10: Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- STEP 11: Verify policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
