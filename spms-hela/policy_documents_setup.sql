-- Create policy_documents table for Official Documents → Policy Documents section

-- Create the table
CREATE TABLE policy_documents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  policy_type TEXT NOT NULL,
  last_updated DATE NOT NULL,
  page_count INTEGER,
  file_size TEXT,
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Archived')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_policy_documents_status ON policy_documents(status);
CREATE INDEX idx_policy_documents_policy_type ON policy_documents(policy_type);
CREATE INDEX idx_policy_documents_last_updated ON policy_documents(last_updated DESC);

-- Enable Row Level Security
ALTER TABLE policy_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Public users can view active policy documents
CREATE POLICY "Public can view active policies"
ON policy_documents
FOR SELECT
USING (status = 'Active');

-- Policy: Authenticated admins can insert policy documents
CREATE POLICY "Admins can insert policies"
ON policy_documents
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Authenticated admins can update policy documents
CREATE POLICY "Admins can update policies"
ON policy_documents
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Authenticated admins can delete policy documents
CREATE POLICY "Admins can delete policies"
ON policy_documents
FOR DELETE
TO authenticated
USING (true);

-- Insert seed data (test policy documents)
INSERT INTO policy_documents (
  title, 
  description, 
  policy_type, 
  last_updated, 
  page_count, 
  file_size, 
  file_url, 
  status
) VALUES
(
  'FODE Student Profile Policy Framework',
  'Guidelines for profile creation, verification, and management.',
  'FODE Policy',
  '2024-01-01',
  48,
  '2.4 MB',
  'https://example.com/placeholder.pdf',
  'Active'
),
(
  'TVET Program Accreditation Policy',
  'Accreditation standards and certification procedures.',
  'TVET Policy',
  '2024-02-01',
  62,
  '3.1 MB',
  'https://example.com/placeholder.pdf',
  'Active'
);

-- Note: After creating the official_documents storage bucket, update the file_url values with actual Supabase Storage URLs

-- Verify the setup
SELECT * FROM policy_documents WHERE status = 'Active' ORDER BY last_updated DESC;
