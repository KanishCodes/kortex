// Groq LLM Integration
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL_PRIMARY = 'llama-3.3-70b-versatile';
const MODEL_FALLBACK = 'llama-3.1-8b-instant';

if (!GROQ_API_KEY) {
  console.warn('⚠️ Missing Groq API key. LLM generation will not work.');
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Generate a response using Groq LLM
 * @param messages - Array of conversation messages
 * @param context - Optional RAG context to inject
 * @returns AI-generated response text
 */
export async function generateResponse(
  messages: GroqMessage[],
  context?: string
): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured');
  }

  // If context provided, inject it as a system message
  const systemMessages: GroqMessage[] = context
    ? [
      {
        role: 'system',
        content: `You are KORTEX, an AI study assistant. Answer questions STRICTLY based on the provided context from the user's documents. If the context doesn't contain the answer, say so clearly.

CONTEXT:
${context}`,
      },
    ]
    : [
      {
        role: 'system',
        content: 'You are KORTEX, an AI study assistant. Answer questions based on the user\'s study materials.',
      },
    ];

  const fullMessages = [...systemMessages, ...messages];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_PRIMARY,
        messages: fullMessages,
        temperature: 0.1, // Strict factual mode
        max_tokens: 1024,
        top_p: 1,
        stream: false, // Will enable streaming in Phase 4
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as GroqResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in Groq response');
    }

    // Log token usage for monitoring
    if (data.usage) {
      console.log(`📊 Tokens: ${data.usage.total_tokens} (prompt: ${data.usage.prompt_tokens}, completion: ${data.usage.completion_tokens})`);
    }

    return content;
  } catch (error: any) {
    console.error('❌ LLM generation failed:', error.message);
    throw error;
  }
}

/**
 * Generate a streaming response (for Phase 4)
 * Currently returns non-streaming, will be enhanced later
 */
export async function generateStreamingResponse(
  messages: GroqMessage[],
  context?: string
): Promise<ReadableStream> {
  // Placeholder for Phase 4 streaming implementation
  throw new Error('Streaming not yet implemented. Use generateResponse() for now.');
}
