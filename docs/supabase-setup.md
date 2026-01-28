# Supabase Database Setup for KORTEX

## Step 1: Create Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Enter details:
   - **Name**: `kortex-db`
   - **Database Password**: (generate strong password and save it)
   - **Region**: Choose closest to you
4. Wait for project to initialize (~2 minutes)

## Step 2: Run SQL Schema

1. In your project, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste the following schema:

```sql
-- Enable Vector Extension
create extension if not exists vector;

-- Subjects Table (Data Boundary)
create table subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Documents Table
create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subject_id uuid references subjects(id) on delete cascade,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Chunks Table
create table chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  user_id uuid not null,
  subject_id uuid references subjects(id) on delete cascade,
  content text not null,
  embedding vector(768), -- Matches @cf/baai/bge-base-en-v1.5
  metadata jsonb
);

-- Vector Search Function (Cosine Similarity)
create or replace function match_chunks_by_subject (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_subject uuid
)
returns table (
  id uuid,
  content text,
  similarity float,
  metadata jsonb
)
language plpgsql
as $$
begin
  return query
  select
    chunks.id,
    chunks.content,
    1 - (chunks.embedding <=> query_embedding) as similarity,
    chunks.metadata
  from chunks
  where 1 - (chunks.embedding <=> query_embedding) > match_threshold
  and chunks.subject_id = filter_subject
  order by chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

4. Click **Run** (bottom right)
5. Verify success message appears

## Step 3: Verify Tables Created

1. Go to **Table Editor** (left sidebar)
2. You should see 3 tables:
   - `subjects`
   - `documents`
   - `chunks`
3. Click on `chunks` table
4. Check that `embedding` column exists with type `vector(768)`

## Step 4: Get API Credentials

1. Go to **Settings** → **API** (left sidebar)
2. Copy the following values:

### Project URL
```
https://[your-project-ref].supabase.co
```
This is your `SUPABASE_URL`

### Service Role Key (Secret)
Under "Project API keys", find **service_role** (NOT anon!)
```
eyJhbGci...
```
This is your `SUPABASE_SERVICE_KEY`

> ⚠️ **IMPORTANT**: Use `service_role` key for backend, NOT `anon` key. The service role bypasses Row Level Security.

## Step 5: Update Backend .env

Add to your `backend/.env`:
```env
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...
```

## Verification Checklist

- [ ] Tables `subjects`, `documents`, `chunks` exist in Table Editor
- [ ] `chunks.embedding` column is type `vector(768)`
- [ ] Function `match_chunks_by_subject` exists (check in SQL Editor)
- [ ] Copied `SUPABASE_URL` to .env
- [ ] Copied `SUPABASE_SERVICE_KEY` to .env

---

You're ready for Phase 2 backend implementation! 🚀
