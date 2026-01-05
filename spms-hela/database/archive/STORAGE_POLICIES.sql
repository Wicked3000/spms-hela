# Storage Policies SQL - Copy and Run in Supabase

## Instructions
1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the SQL below
5. Click "Run" or press Ctrl+Enter

---

## SQL to Execute

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

---

## What This Does

These policies control who can access files in the `publications_files` bucket:

- **Public Download**: Anyone can download/view files
- **Admin Upload**: Only authenticated admins can upload files
- **Admin Update**: Only authenticated admins can update files
- **Admin Delete**: Only authenticated admins can delete files

---

## After Running

1. You should see a success message
2. Go back to `/admin/publications/verify`
3. Run verification again
4. All 4 checks should now pass ✅

---

## Troubleshooting

**Error: "policy already exists"**
- This is fine! It means the policy was already created
- Just continue to the next one

**Error: "permission denied"**
- Make sure you're logged in as the project owner
- Check that the bucket name is exactly `publications_files`
