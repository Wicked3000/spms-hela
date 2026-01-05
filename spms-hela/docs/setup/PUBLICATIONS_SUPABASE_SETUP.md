# Publications Module - Supabase Setup Guide

## Database Table Creation

Execute the following SQL in your Supabase SQL Editor:

```sql
-- Create published_documents table
CREATE TABLE published_documents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  file_url TEXT NOT NULL,
  file_size TEXT,
  page_count INTEGER,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Archived'))
);

-- Create index for faster queries
CREATE INDEX idx_published_documents_status ON published_documents(status);
CREATE INDEX idx_published_documents_category ON published_documents(category);
CREATE INDEX idx_published_documents_uploaded_at ON published_documents(uploaded_at DESC);

-- Enable Row Level Security
ALTER TABLE published_documents ENABLE ROW LEVEL SECURITY;

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
```

## Storage Bucket Creation

1. Go to Supabase Dashboard → Storage
2. Click "New Bucket"
3. Bucket name: `publications_files`
4. Set to **Public** (for easy public downloads)
5. Click "Create Bucket"

### Storage Policies

Execute in SQL Editor:

```sql
-- Allow public to download files
CREATE POLICY "Public can download files"
ON storage.objects FOR SELECT
USING (bucket_id = 'publications_files');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'publications_files');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'publications_files');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'publications_files');
```

## Verification

After setup, verify:

1. ✅ Table `published_documents` exists
2. ✅ RLS is enabled on table
3. ✅ Storage bucket `publications_files` exists
4. ✅ Bucket is public or has proper policies
5. ✅ Policies allow public SELECT for active documents
6. ✅ Policies allow authenticated INSERT/UPDATE/DELETE

## Categories

Recommended categories:

- Guide
- Handbook
- Report
- Policy
- Success Stories
- Annual Report
- Resource

## Status Options

- **Active**: Visible to public
- **Archived**: Hidden from public, admin-only

---

**Setup Complete!** ✅

Now proceed with implementing the admin upload interface and public publications page.
