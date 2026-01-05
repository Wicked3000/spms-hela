-- Add new columns to published_documents table for featured publications

-- Add is_featured column
ALTER TABLE published_documents 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Add published_month column (e.g., "December", "January")
ALTER TABLE published_documents 
ADD COLUMN IF NOT EXISTS published_month TEXT;

-- Add published_year column (e.g., "2024", "2025")
ALTER TABLE published_documents 
ADD COLUMN IF NOT EXISTS published_year TEXT;

-- Create index for faster featured queries
CREATE INDEX IF NOT EXISTS idx_published_documents_featured 
ON published_documents(is_featured, status);

-- Update existing records to have publication dates (optional - adjust as needed)
UPDATE published_documents 
SET 
  published_month = TO_CHAR(uploaded_at, 'Month'),
  published_year = TO_CHAR(uploaded_at, 'YYYY')
WHERE published_month IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'published_documents'
ORDER BY ordinal_position;
