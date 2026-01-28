// Cloudflare Workers AI - Embedding Generation
import dotenv from 'dotenv';

dotenv.config();

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5';

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
  console.warn('⚠️ Missing Cloudflare credentials. Embedding generation will not work.');
}

/**
 * Generate embeddings using Cloudflare Workers AI
 * @param text - Text to embed
 * @returns 768-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    throw new Error('Cloudflare credentials not configured');
  }

  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${EMBEDDING_MODEL}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: [text] }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as any;

    // Cloudflare returns: { result: { data: [[vector]] } }
    const embedding = data.result?.data?.[0];

    if (!embedding || !Array.isArray(embedding)) {
      throw new Error('Invalid embedding response from Cloudflare');
    }

    if (embedding.length !== 768) {
      throw new Error(`Expected 768-dimensional vector, got ${embedding.length}`);
    }

    return embedding;
  } catch (error: any) {
    console.error('❌ Embedding generation failed:', error.message);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in batch
 * @param texts - Array of texts to embed
 * @returns Array of 768-dimensional vectors
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    throw new Error('Cloudflare credentials not configured');
  }

  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/${EMBEDDING_MODEL}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: texts }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as any;
    const embeddings = data.result?.data;

    if (!embeddings || !Array.isArray(embeddings)) {
      throw new Error('Invalid batch embedding response from Cloudflare');
    }

    return embeddings;
  } catch (error: any) {
    console.error('❌ Batch embedding generation failed:', error.message);
    throw error;
  }
}
