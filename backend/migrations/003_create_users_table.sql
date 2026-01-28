-- ============================================================================
-- KORTEX Phase 5: Authentication & User Identity
-- Create users table for Google OAuth identity mapping
-- ============================================================================

-- Users Table - Maps Google email to UUID
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT, -- Google profile picture URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- Optional: Add foreign key constraints to existing tables
-- This ensures data integrity and cascading deletes
-- ============================================================================

-- Add constraint to subjects table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_subjects_user'
  ) THEN
    ALTER TABLE subjects 
    ADD CONSTRAINT fk_subjects_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add constraint to documents table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_documents_user'
  ) THEN
    ALTER TABLE documents 
    ADD CONSTRAINT fk_documents_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add constraint to chunks table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_chunks_user'
  ) THEN
    ALTER TABLE chunks 
    ADD CONSTRAINT fk_chunks_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================================
-- Verification Query
-- ============================================================================

-- Run this to verify table was created:
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
