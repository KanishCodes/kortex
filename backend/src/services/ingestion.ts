// Document Ingestion Service
// Handles PDF parsing, chunking, embedding generation, and storage

import { supabase } from './supabase';
import { generateEmbedding } from './cloudflare';
import { chunkText, getChunkMetadata } from '../utils/chunker';

// Import pdf-parse v1.1.1 (simple default export)
// @ts-ignore - CommonJS import
const pdfParse = require('pdf-parse');

export interface ProcessDocumentResult {
  documentId: string;
  chunksGenerated: number;
  title: string;
}

/**
 * Process a PDF document: parse, chunk, embed, and store
 * 
 * @param fileBuffer - PDF file buffer
 * @param fileName - Original file name
 * @param subjectId - Subject UUID for isolation
 * @param userId - User UUID for ownership
 * @returns Processing result with document ID and chunk count
 */
export async function processDocument(
  fileBuffer: Buffer,
  fileName: string,
  subjectId: string,
  userId: string
): Promise<ProcessDocumentResult> {
  try {
    console.log(`📄 Processing document: ${fileName}`);

    // Step 1: Parse PDF and extract text
    console.log('  1️⃣ Extracting text from PDF...');
    const pdfData = await pdfParse(fileBuffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      throw new Error('PDF contains no extractable text');
    }

    console.log(`     ✅ Extracted ${rawText.length} characters`);

    // Step 2: Record document in database
    console.log('  2️⃣ Creating document record...');
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        subject_id: subjectId,
        title: fileName
      })
      .select()
      .single();

    if (docError || !document) {
      throw new Error(`Failed to create document: ${docError?.message}`);
    }

    console.log(`     ✅ Document ID: ${document.id}`);

    // Step 3: Chunk the text
    console.log('  3️⃣ Chunking text...');
    const chunks = chunkText(rawText, 600, 100);
    console.log(`     ✅ Generated ${chunks.length} chunks`);

    if (chunks.length === 0) {
      throw new Error('No chunks generated from document');
    }

    // Step 4: Generate embeddings for all chunks (batch processing)
    console.log('  4️⃣ Generating embeddings...');
    const embeddings: number[][] = [];

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);
      embeddings.push(embedding);

      if ((i + 1) % 10 === 0) {
        console.log(`     📊 Progress: ${i + 1}/${chunks.length} embeddings generated`);
      }
    }

    console.log(`     ✅ All ${embeddings.length} embeddings generated`);

    // Step 5: Prepare chunk records for database
    console.log('  5️⃣ Storing chunks in database...');
    const chunkRecords = chunks.map((chunkText, index) => ({
      document_id: document.id,
      user_id: userId,
      subject_id: subjectId,
      content: chunkText,
      embedding: embeddings[index],
      metadata: getChunkMetadata(index, chunks.length)
    }));

    // Step 6: Insert all chunks into database
    const { error: chunksError } = await supabase
      .from('chunks')
      .insert(chunkRecords);

    if (chunksError) {
      throw new Error(`Failed to store chunks: ${chunksError.message}`);
    }

    console.log(`     ✅ Stored ${chunkRecords.length} chunks`);
    console.log(`✅ Document processing complete!\n`);

    return {
      documentId: document.id,
      chunksGenerated: chunks.length,
      title: fileName
    };

  } catch (error: any) {
    console.error('❌ Document processing failed:', error.message);
    throw error;
  }
}

/**
 * Delete a document and all its chunks
 */
export async function deleteDocument(documentId: string): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (error) {
    throw new Error(`Failed to delete document: ${error.message}`);
  }

  // Chunks are automatically deleted via CASCADE
}

/**
 * Get all documents for a subject
 */
export async function getDocumentsBySubject(subjectId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('id, title, created_at')
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }

  return data;
}
