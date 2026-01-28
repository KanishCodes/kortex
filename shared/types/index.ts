// Shared TypeScript types for KORTEX
// Used by both frontend and backend

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  xrayContext?: XRayContext;
}

export interface XRayContext {
  retrievedChunks: RetrievedChunk[];
  inferenceTime: string; // e.g. "0.4s"
  model?: string;
}

export interface RetrievedChunk {
  id: string;
  text: string;
  similarity: number; // 0.0 to 1.0
  source: string; // e.g., "Page 12"
  metadata?: Record<string, any>;
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  documentCount: number;
  createdAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  fileSize?: number;
  pageCount?: number;
  createdAt: Date;
}

export interface Chunk {
  id: string;
  documentId: string;
  userId: string;
  subjectId: string;
  content: string;
  embedding?: number[]; // 768-dimensional vector
  metadata: {
    page?: number;
    chunkIndex?: number;
    sourceLabel?: string;
  };
}

export interface UserPreferences {
  xrayMode: boolean;
  crossSubject: boolean;
  theme?: 'light' | 'dark';
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  preferences: UserPreferences;
}

// API Request/Response types
export interface QueryRequest {
  question: string;
  subjectId: string;
  xrayMode?: boolean;
  stream?: boolean;
}

export interface QueryResponse {
  answer: string;
  xrayContext?: XRayContext;
  messageId: string;
}

export interface UploadRequest {
  file: File;
  subjectId: string;
}

export interface UploadResponse {
  documentId: string;
  title: string;
  chunksCreated: number;
}
