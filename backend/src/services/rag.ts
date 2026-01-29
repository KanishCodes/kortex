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
        answer: "⚠️ **I couldn't find this information in your uploaded documents.**\n\nTry:\n- Uploading more relevant documents\n- Rephrasing your question\n- Asking about topics covered in your materials",
        retrievedChunks: []
      };
    }

    // Check if all chunks have low similarity (potential hallucination risk)
    const maxSimilarity = Math.max(...chunks.map((c: any) => c.similarity));
    if (maxSimilarity < 0.5) {
      console.log(`     ⚠️  Low confidence (max similarity: ${maxSimilarity.toFixed(3)})`);
      return {
        answer: "⚠️ **I found some related content, but I'm not confident it answers your question.**\n\nThe information in your documents might not cover this topic in detail. Try:\n- Uploading more specific documents\n- Asking a different question\n- Rephrasing to match the content in your materials",
        retrievedChunks: chunks.map((chunk: any) => ({
          id: chunk.id,
          content: chunk.content,
          similarity: chunk.similarity,
          metadata: chunk.metadata
        }))
      };
    }

    console.log(`     ✅ Found ${chunks.length} relevant chunks (max similarity: ${maxSimilarity.toFixed(3)})`);

    // Step 3: Construct context from retrieved chunks
    const context = chunks
      .map((chunk: any, index: number) =>
        `[Source ${index + 1}] ${chunk.content}`
      )
      .join('\n\n');

    console.log(`     📝 Context length: ${context.length} characters`);

    // Step 4: Build prompt with system instructions and context
    const systemPrompt = `You are KORTEX, a helpful study assistant. Your role is to help students learn from their uploaded documents.

IMPORTANT CAPABILITIES:
1. Answer factual questions based on the context
2. CREATE study materials (practice questions, summaries, examples) USING the context
3. Explain concepts from the documents in different ways
4. Generate quizzes, flashcards, or exam questions BASED ON the material

RULES:
1. Always base your responses on the provided context
2. For generative requests (create questions, make a summary, etc.), USE the context to generate appropriate content
3. For factual questions, only answer if the information is in the context
4. Be educational and student-focused - your goal is to help them learn
5. Use markdown formatting (bold, lists, code blocks) to make responses clear
6. If context is insufficient for the specific request, explain what's missing

Remember: "Create practice questions" means generate questions FROM the context, not find questions IN the context.`;

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
