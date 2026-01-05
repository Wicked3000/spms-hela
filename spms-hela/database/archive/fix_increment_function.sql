-- Fix for increment_download_count function security issue
-- This updates the existing function to include a safe search_path

DROP FUNCTION IF EXISTS increment_download_count(INTEGER);

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
