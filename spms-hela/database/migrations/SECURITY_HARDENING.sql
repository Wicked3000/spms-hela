-- SECURITY HARDENING: Restrict student_profiles management to Admins only
-- This fixes the 'admin_all_access' policy which was too permissive

BEGIN;

-- 1. Redefine 'student_profiles' policies
DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'student_profiles') LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON student_profiles', r.policyname); 
    END LOOP; 
END $$;

-- Policy: Everyone can view student profiles (required for university portal)
CREATE POLICY "public_view_profiles" 
ON student_profiles FOR SELECT 
TO public 
USING (true);

-- Policy: ONLY Admins can perform ALL actions
CREATE POLICY "admin_management_access" 
ON student_profiles FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  )
);


-- 2. Verify 'student_selections' policies
-- Ensure university users can only manage their own selections
DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'student_selections') LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON student_selections', r.policyname); 
    END LOOP; 
END $$;

CREATE POLICY "Users can view own selections"
ON student_selections FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

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

CREATE POLICY "Users can update own selections"
ON student_selections FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own selections"
ON student_selections FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


-- 3. Verify 'user_profiles' policies
DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles') LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', r.policyname); 
    END LOOP; 
END $$;

CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
ON user_profiles FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM user_profiles u WHERE u.id = auth.uid() AND u.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_profiles u WHERE u.id = auth.uid() AND u.role = 'admin'));

COMMIT;
