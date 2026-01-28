// RAG (Retrieval-Augmented Generation) Service
// Handles query embedding, vector search, and context-aware answer generation

import { supabase } from './supabase';
import { generateEmbedding } from './cloudflare';
import { generateResponse } from './groq';

export interface RetrievedChunk {
  id: string;
  content: string;
  similarity: number;
  metadata: {
    chunkIndex: number;
    totalChunks: number;
    sourceLabel: string;
  };
}

export interface RAGResponse {
  answer: string;
  retrievedChunks: RetrievedChunk[];
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

/**
 * Query the RAG system: embed question, retrieve relevant chunks, generate answer
 * 
 * @param question - User's question
 * @param subjectId - Subject UUID for isolated search
 * @param similarityThreshold - Minimum similarity score (default: 0.5)
 * @param maxChunks - Maximum chunks to retrieve (default: 5)
 * @returns RAG response with answer and X-Ray data
 */
export async function queryRAG(
  question: string,
  subjectId: string,
  similarityThreshold: number = 0.5,
  maxChunks: number = 5
): Promise<RAGResponse> {
  try {
    console.log(`🔍 RAG Query: "${question}"`);
    console.log(`   Subject ID: ${subjectId}`);

    // Step 1: Embed the user's question
    console.log('  1️⃣ Generating query embedding...');
    const queryEmbedding = await generateEmbedding(question);
    console.log('     ✅ Query embedded');

    // Step 2: Search for relevant chunks using vector similarity
    console.log('  2️⃣ Searching for relevant chunks...');
    const { data: chunks, error } = await supabase.rpc('match_chunks_by_subject', {
      query_embedding: queryEmbedding,
      match_threshold: similarityThreshold,
      match_count: maxChunks,
      filter_subject: subjectId
    });

    if (error) {
      throw new Error(`Vector search failed: ${error.message}`);
    }

    if (!chunks || chunks.length === 0) {
      console.log('     ⚠️  No relevant chunks found');
      return {
        answer: "I couldn't find any relevant information in your uploaded documents to answer this question. Please make sure you've uploaded documents related to this topic.",
        retrievedChunks: []
      };
    }

    console.log(`     ✅ Found ${chunks.length} relevant chunks`);

    // Step 3: Construct context from retrieved chunks
    const context = chunks
      .map((chunk: any, index: number) =>
        `[Source ${index + 1}] ${chunk.content}`
      )
      .join('\n\n');

    console.log(`     📝 Context length: ${context.length} characters`);

    // Step 4: Build prompt with system instructions and context
    const systemPrompt = `You are KORTEX, a helpful study assistant. Your role is to answer questions based STRICTLY on the provided document context.

RULES:
1. Only use information from the context below
2. If the context doesn't contain enough information, say so clearly
3. Be concise but comprehensive
4. Use bullet points or numbered lists when appropriate
5. If asked about something not in the context, politely state you can only answer from uploaded documents`;

    const userPrompt = `Context from uploaded documents:

${context}

Question: ${question}

Please provide a clear, accurate answer based only on the context above.`;

    // Step 5: Generate response using Groq
    console.log('  3️⃣ Generating answer with LLM...');
    const answer = await generateResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    console.log('     ✅ Answer generated');
    console.log(`✅ RAG query complete\n`);

    // Step 6: Return response with X-Ray data
    return {
      answer,
      retrievedChunks: chunks.map((chunk: any) => ({
        id: chunk.id,
        content: chunk.content,
        similarity: chunk.similarity,
        metadata: chunk.metadata
      }))
    };

  } catch (error: any) {
    console.error('❌ RAG query failed:', error.message);
    throw error;
  }
}

/**
 * Test RAG system with a sample query
 */
export async function testRAG(subjectId: string): Promise<void> {
  const testQuestion = "What is the main topic discussed in the documents?";
  const result = await queryRAG(testQuestion, subjectId);

  console.log('\n🧪 RAG Test Results:');
  console.log(`Question: ${testQuestion}`);
  console.log(`Answer: ${result.answer}`);
  console.log(`Chunks Retrieved: ${result.retrievedChunks.length}`);
  console.log('\nRetrieved Chunks:');
  result.retrievedChunks.forEach((chunk, i) => {
    console.log(`  ${i + 1}. Similarity: ${chunk.similarity.toFixed(3)} - ${chunk.content.substring(0, 100)}...`);
  });
}
