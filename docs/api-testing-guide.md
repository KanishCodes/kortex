# Phase 3 RAG Pipeline - API Testing Guide

## Overview
This document provides instructions for testing the RAG (Retrieval-Augmented Generation) pipeline endpoints.

## Prerequisites
1. Backend server running: `bun run dev` (port 4000)
2. Sample PDF file ready for upload
3. Supabase project configured with tables

## API Endpoints

### 1. Upload Document

**Endpoint:** `POST http://localhost:4000/api/upload`

**Content-Type:** `multipart/form-data`

**Required fields:**
- `file` - PDF file (binary)
- `subjectId` - UUID of the subject (create one manually in Supabase or generate using UUID generator)
- `userId` - UUID of the user

**Using cURL:**
```bash
curl -X POST http://localhost:4000/api/upload \
  -F "file=@path/to/your/document.pdf" \
  -F 'subjectId=123e4567-e89b-12d3-a456-426614174000' \
  -F 'userId=123e4567-e89b-12d3-a456-426614174999'
```

**Expected Response:**
```json
{
  "success": true,
  "documentId": "uuid-here",
  "chunksGenerated": 15,
  "title": "document.pdf",
  "message": "Successfully processed document.pdf into 15 chunks"
}
```

---

### 2. Chat / Ask Question

**Endpoint:** `POST http://localhost:4000/api/chat`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "message": "What is the main topic discussed in the document?",
  "subjectId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Using cURL:**
```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the main topic discussed in the document?",
    "subjectId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "answer": "Based on the uploaded documents, the main topic is...",
  "xrayContext": {
    "retrievedChunks": [
      {
        "id": "chunk-uuid",
        "content": "The actual text from the document chunk...",
        "similarity": 0.85,
        "metadata": {
          "chunkIndex": 0,
          "totalChunks": 15,
          "sourceLabel": "Chunk 1/15"
        }
      }
    ],
    "chunkCount": 5
  }
}
```

---

## Quick Test Workflow

### Step 1: Create Subject IDs
First, manually create a subject in Supabase or use this UUID generator:
- Subject ID: `550e8400-e29b-41d4-a716-446655440000`
- User ID: `550e8400-e29b-41d4-a716-446655440001`

Insert into Supabase SQL Editor:
```sql
INSERT INTO subjects (id, user_id, name) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440001', 
  'Computer Science'
);
```

### Step 2: Upload a PDF
```bash
curl -X POST http://localhost:4000/api/upload \
  -F "file=@sample.pdf" \
  -F 'subjectId=550e8400-e29b-41d4-a716-446655440000' \
  -F 'userId=550e8400-e29b-41d4-a716-446655440001'
```

### Step 3: Ask a Question
```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Summarize the key points",
    "subjectId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Step 4: Verify in Supabase
1. Go to Supabase → Table Editor
2. Check `documents` table - should have 1 row with your PDF
3. Check `chunks` table - should have multiple rows (chunks) with embeddings

---

## Troubleshooting

### Error: "No file uploaded"
- Ensure you're using `multipart/form-data` content type
- Check file field name is exactly `file`

### Error: "Missing required fields"
- Verify `subjectId` and `userId` are valid UUIDs
- Create subject in database first

### Error: "PDF contains no extractable text"
- PDF might be scanned images (no selectable text)
- Try a different PDF with actual text content

### No chunks found when asking questions
- Upload may have failed - check backend logs
- Subject ID mismatch - ensure same ID used for upload and chat
- Check Supabase `chunks` table has data

---

## Testing with Postman

**Upload Document:**
1. Create new POST request to `http://localhost:4000/api/upload`
2. Go to Body → form-data
3. Add key `file` (type: File) and select PDF
4. Add key `subjectId` (type: Text) with UUID value
5. Add key `userId` (type: Text) with UUID value
6. Click Send

**Chat:**
1. Create new POST request to `http://localhost:4000/api/chat`
2. Go to Body → raw → JSON
3. Paste:
   ```json
   {
     "message": "Your question here",
     "subjectId": "uuid-here"
   }
   ```
4. Click Send
