-- Temporarily disable RLS to test if the app works
-- WARNING: This makes the table publicly writable - only for testing!

ALTER TABLE published_documents DISABLE ROW LEVEL SECURITY;

-- After testing, you can re-enable it with:
-- ALTER TABLE published_documents ENABLE ROW LEVEL SECURITY;
