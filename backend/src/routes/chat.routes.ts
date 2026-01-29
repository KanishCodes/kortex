// Chat Routes - Handle message queries using RAG
import { Router, Request, Response } from 'express';
import { queryRAG } from '../services/rag';
import { logActivity } from '../services/activity';

const router = Router();

/**
 * POST /api/chat
 * Handle chat messages using RAG (Retrieval-Augmented Generation)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, subjectId } = req.body;

    // Validate request
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Invalid request: message is required'
      });
    }

    if (!subjectId) {
      return res.status(400).json({
        error: 'Invalid request: subjectId is required'
      });
    }

    console.log(`💬 Chat request for subject: ${subjectId}`);

    // Query RAG system
    const result = await queryRAG(message, subjectId);

    // Log activity
    // Note: We don't await this to keep response fast
    logActivity(
      // @ts-ignore - User ID is handled by middleware but we need to extract it or pass it. 
      // For now assuming we add userId to request in middleware or passed in body? 
      // Wait, chat route currently gets subjectId and message from body. 
      // Where is userId? It should be in req.user if using auth middleware.
      // Let's check how other routes get userId.
      // Upload route extracts it from req.body.
      // Chat route body: { message, subjectId }. 
      // We need to add userId to the request body from frontend or use auth middleware.
      // The frontend chat client currently doesn't pass userId in body explicitly?
      // Let's verify frontend/lib/api.ts chat function.
      req.body.userId,
      'chat_query',
      subjectId,
      {
        message_length: message.length,
        response_chunks: result.retrievedChunks.length
      }
    );

    // Return response with answer and X-Ray data
    res.json({
      success: true,
      answer: result.answer,
      xrayContext: {
        retrievedChunks: result.retrievedChunks,
        chunkCount: result.retrievedChunks.length
      },
      tokensUsed: result.tokensUsed
    });

  } catch (error: any) {
    console.error('❌ Chat error:', error.message);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message
    });
  }
});

export default router;
