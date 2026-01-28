// Frontend-specific types for KORTEX UI

export interface RetrievedChunk {
  id: string;
  content: string;
  similarity: number; // 0.0 to 1.0
  sourceLabel: string; // e.g. "Page 12"
}

export interface XRayContext {
  retrievedChunks: RetrievedChunk[];
  inferenceTime: number; // in seconds
}

// Extend the shared ChatMessage type for frontend use
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  xrayContext?: XRayContext;
}
