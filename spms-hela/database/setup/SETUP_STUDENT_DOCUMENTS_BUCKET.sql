-- Create student_documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('student_documents', 'student_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for student_documents bucket

-- 1. Allow authenticated users (admins) to upload student documents
CREATE POLICY "Admins can upload student documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'student_documents');

-- 2. Allow authenticated users (admins) to view student documents
CREATE POLICY "Admins can view student documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'student_documents');

-- 3. Allow authenticated users (admins) to delete student documents
CREATE POLICY "Admins can delete student documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'student_documents');

-- 4. Allow authenticated users (admins) to update student documents
CREATE POLICY "Admins can update student documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'student_documents');
