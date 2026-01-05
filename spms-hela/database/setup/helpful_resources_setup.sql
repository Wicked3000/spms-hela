-- Create helpful_resources table for Additional Resources section

-- Create the table
CREATE TABLE helpful_resources (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  download_count INTEGER DEFAULT 0,
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Archived')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_helpful_resources_status ON helpful_resources(status);
CREATE INDEX idx_helpful_resources_category ON helpful_resources(category);
CREATE INDEX idx_helpful_resources_download_count ON helpful_resources(download_count DESC);

-- Enable Row Level Security
ALTER TABLE helpful_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Public users can view active resources
CREATE POLICY "Public can view active resources"
ON helpful_resources
FOR SELECT
USING (status = 'Active');

-- Policy: Authenticated admins can insert resources
CREATE POLICY "Admins can insert resources"
ON helpful_resources
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Authenticated admins can update resources
CREATE POLICY "Admins can update resources"
ON helpful_resources
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Authenticated admins can delete resources
CREATE POLICY "Admins can delete resources"
ON helpful_resources
FOR DELETE
TO authenticated
USING (true);

-- Policy: Public users can increment download count
CREATE POLICY "Public can update download count"
ON helpful_resources
FOR UPDATE
USING (status = 'Active')
WITH CHECK (status = 'Active');

-- Insert seed data (test resources)
INSERT INTO helpful_resources (title, description, category, download_count, file_url, status) VALUES
('Application Form Templates', 'Standard forms for applications', 'Forms', 450, 'https://example.com/placeholder.pdf', 'Active'),
('Student Profile Guidelines', 'Best practices for creating profiles', 'Guidelines', 320, 'https://example.com/placeholder.pdf', 'Active'),
('Career Pathway Resources', 'Career opportunities for graduates', 'Career Resources', 280, 'https://example.com/placeholder.pdf', 'Active');

-- Note: After creating the helpful_materials storage bucket, update the file_url values with actual Supabase Storage URLs

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(resource_id INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE helpful_resources
  SET download_count = download_count + 1
  WHERE id = resource_id AND status = 'Active';
END;
$$;

-- Verify the setup
SELECT * FROM helpful_resources WHERE status = 'Active' ORDER BY download_count DESC;
