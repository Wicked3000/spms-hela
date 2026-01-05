-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view active documents" ON published_documents;
DROP POLICY IF EXISTS "Admins can insert documents" ON published_documents;
DROP POLICY IF EXISTS "Admins can update documents" ON published_documents;
DROP POLICY IF EXISTS "Admins can delete documents" ON published_documents;

-- Recreate all policies

-- Policy: Public users can view active documents
CREATE POLICY "Public can view active documents"
ON published_documents
FOR SELECT
USING (status = 'Active');

-- Policy: Authenticated admins can insert documents
CREATE POLICY "Admins can insert documents"
ON published_documents
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Authenticated admins can update documents
CREATE POLICY "Admins can update documents"
ON published_documents
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Authenticated admins can delete documents
CREATE POLICY "Admins can delete documents"
ON published_documents
FOR DELETE
TO authenticated
USING (true);
