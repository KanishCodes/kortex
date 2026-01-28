// API Client for KORTEX Backend
// Centralized layer for all backend communication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Types matching backend responses
export interface Subject {
  id: string;
  name: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

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

export interface ChatResponse {
  success: boolean;
  answer: string;
  xrayContext: {
    retrievedChunks: RetrievedChunk[];
    chunkCount: number;
  };
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface UploadResponse {
  success: boolean;
  documentId: string;
  chunksGenerated: number;
  title: string;
  message: string;
}

// Helper for handling API errors
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new APIError(response.status, error.message || error.error);
  }
  return response.json();
}

// ============================================================================
// SUBJECT MANAGEMENT
// ============================================================================

/**
 * Get all subjects for a user
 */
export async function getSubjects(userId: string): Promise<Subject[]> {
  const response = await fetch(`${API_URL}/subjects?userId=${userId}`);
  const data = await handleResponse<{ success: boolean; subjects: Subject[] }>(response);
  return data.subjects;
}

/**
 * Create a new subject
 */
export async function createSubject(userId: string, name: string): Promise<Subject> {
  const response = await fetch(`${API_URL}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, name }),
  });

  const data = await handleResponse<{ success: boolean; subject: Subject }>(response);
  return data.subject;
}

/**
 * Delete a subject
 */
export async function deleteSubject(userId: string, subjectId: string): Promise<void> {
  const response = await fetch(`${API_URL}/subjects/${subjectId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  await handleResponse<{ success: boolean }>(response);
}

// ============================================================================
// DOCUMENT MANAGEMENT
// ============================================================================

/**
 * Upload a PDF document to a subject
 */
export async function uploadDocument(
  userId: string,
  subjectId: string,
  file: File,
  _onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  formData.append('subjectId', subjectId);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
    // Note: Don't set Content-Type header - browser will set it with boundary
  });

  return handleResponse<UploadResponse>(response);
}

// ============================================================================
// CHAT / RAG
// ============================================================================

/**
 * Send a chat message and get RAG-powered response
 */
export async function chat(
  _userId: string,
  subjectId: string,
  message: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, subjectId }),
  });

  return handleResponse<ChatResponse>(response);
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check if backend is healthy
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(API_URL.replace('/api', '/health'));
    return response.ok;
  } catch {
    return false;
  }
}

// Export API error for error handling in components
export { APIError };
