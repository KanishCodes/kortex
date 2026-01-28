// Shared constants for KORTEX

export const EMBEDDING_DIMENSIONS = 768;
export const CHUNK_SIZE = 600; // tokens
export const CHUNK_OVERLAP = 100; // tokens
export const SIMILARITY_THRESHOLD = 0.7;
export const MAX_RETRIEVED_CHUNKS = 5;

export const AI_MODELS = {
  EMBEDDING: '@cf/baai/bge-base-en-v1.5',
  LLM_PRIMARY: 'llama-3.3-70b-versatile',
  LLM_FALLBACK: 'llama-3.1-8b-instant',
} as const;

export const API_ENDPOINTS = {
  CLOUDFLARE_AI: 'https://api.cloudflare.com/client/v4/accounts',
  GROQ: 'https://api.groq.com/openai/v1/chat/completions',
} as const;

export const ALLOWED_FILE_TYPES = ['application/pdf'] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
