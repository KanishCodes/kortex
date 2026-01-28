// Text Chunking Utility for RAG
// Splits long text into overlapping chunks for embedding generation

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Clean text by removing excessive whitespace and normalizing newlines
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')           // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')       // Max 2 consecutive newlines
    .replace(/[ \t]+/g, ' ')          // Normalize spaces
    .trim();
}

/**
 * Split text into sentences using common sentence boundaries
 */
function splitIntoSentences(text: string): string[] {
  // Split on sentence endings followed by whitespace
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.filter(s => s.trim().length > 0);
}

/**
 * Chunk text into overlapping segments for RAG
 * 
 * @param text - The text to chunk
 * @param maxTokens - Maximum tokens per chunk (default: 600)
 * @param overlapTokens - Number of tokens to overlap between chunks (default: 100)
 * @returns Array of text chunks
 */
export function chunkText(
  text: string,
  maxTokens: number = 600,
  overlapTokens: number = 100
): string[] {
  // Step 1: Clean the input text
  const cleaned = cleanText(text);

  // Step 2: Split into sentences
  const sentences = splitIntoSentences(cleaned);

  if (sentences.length === 0) {
    return [];
  }

  // Step 3: Build chunks
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentTokenCount = 0;

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence);

    // If adding this sentence would exceed limit, save current chunk
    if (currentTokenCount + sentenceTokens > maxTokens && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));

      // Calculate overlap: keep last few sentences
      let overlapText = '';
      let overlapCount = 0;

      // Work backwards to build overlap
      for (let i = currentChunk.length - 1; i >= 0; i--) {
        const sentTokens = estimateTokens(currentChunk[i]);
        if (overlapCount + sentTokens <= overlapTokens) {
          overlapText = currentChunk[i] + ' ' + overlapText;
          overlapCount += sentTokens;
        } else {
          break;
        }
      }

      // Start new chunk with overlap
      currentChunk = overlapText.trim() ? [overlapText.trim()] : [];
      currentTokenCount = overlapCount;
    }

    // Add sentence to current chunk
    currentChunk.push(sentence);
    currentTokenCount += sentenceTokens;
  }

  // Add final chunk if it exists
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}

/**
 * Get chunk metadata for a given chunk
 */
export function getChunkMetadata(chunkIndex: number, totalChunks: number) {
  return {
    chunkIndex,
    totalChunks,
    sourceLabel: `Chunk ${chunkIndex + 1}/${totalChunks}`
  };
}
