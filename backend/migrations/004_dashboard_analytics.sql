-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'upload_document', 'create_subject', 'chat_query'
    entity_id UUID, -- UUID of the document, subject, etc.
    metadata JSONB DEFAULT '{}'::jsonb, -- Store details like title, subject_name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries on user activity
CREATE INDEX IF NOT EXISTS activity_logs_user_id_idx ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx ON activity_logs(created_at DESC);
