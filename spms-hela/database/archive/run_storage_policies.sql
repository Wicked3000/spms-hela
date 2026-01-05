-- Storage Policies for publications_files bucket

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
