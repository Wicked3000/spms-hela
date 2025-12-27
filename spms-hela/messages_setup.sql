-- Create messages table for contact form submissions

-- Create the table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Responded')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_email ON messages(email);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Public users can insert messages
CREATE POLICY "Public can insert messages"
ON messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Authenticated admins can view all messages
CREATE POLICY "Admins can view all messages"
ON messages
FOR SELECT
TO authenticated
USING (true);

-- Policy: Authenticated admins can update messages
CREATE POLICY "Admins can update messages"
ON messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Authenticated admins can delete messages
CREATE POLICY "Admins can delete messages"
ON messages
FOR DELETE
TO authenticated
USING (true);

-- Verify the setup
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;
