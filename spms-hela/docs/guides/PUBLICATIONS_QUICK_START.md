# Quick Start Guide - Publications Module

## ⚠️ Setup Required

The Publications module requires database setup before it can be used. Follow these steps:

---

## Step 1: Create Database Table

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the following SQL:

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

-- Create indexes for faster queries
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

5. Click **Run** or press `Ctrl+Enter`
6. Verify success message appears

---

## Step 2: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. Enter bucket name: `publications_files`
4. Set **Public bucket**: ✅ **ON** (for easy public downloads)
5. Click **Create Bucket**

---

## Step 3: Configure Storage Policies

1. Go to **SQL Editor** again
2. Run this SQL:

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

3. Click **Run**

---

## Step 4: Verify Setup

### Check Table

1. Go to **Table Editor** in Supabase
2. Look for `published_documents` table
3. Should see columns: id, title, category, description, etc.

### Check Storage

1. Go to **Storage**
2. Look for `publications_files` bucket
3. Should be marked as **Public**

---

## Step 5: Test Upload

1. Navigate to `/admin/publications` in your app
2. Click **Upload New Document**
3. Fill in the form:
   - Title: "Test Document"
   - Category: "Guide"
   - Description: "Test upload"
   - Select a PDF file
4. Click **Upload Document**
5. Should see success message
6. Document should appear in table

---

## Step 6: Test Public View

1. Navigate to `/publications`
2. Should see the uploaded document in the table
3. Click **Download** button
4. PDF should open in new tab

---

## ✅ Setup Complete!

Once all steps are done:

- ✅ Table created with RLS
- ✅ Storage bucket created
- ✅ Policies configured
- ✅ Upload tested
- ✅ Public view tested

---

## 🔧 Troubleshooting

### Error: "relation does not exist"

**Solution**: Run Step 1 SQL to create the table

### Error: "bucket not found"

**Solution**: Create the storage bucket in Step 2

### Upload fails

**Solution**: Check storage policies in Step 3

### Can't see documents on public page

**Solution**: Make sure documents have status = 'Active'

### Download doesn't work

**Solution**: Verify bucket is public or has correct policies

---

## 📚 Full Documentation

For complete details, see:

- `PUBLICATIONS_SUPABASE_SETUP.md` - Detailed setup guide
- `PUBLICATIONS_MODULE.md` - Complete feature documentation

---

**Need Help?** Check the console for specific error messages.
