// Chat Routes - Handle message queries using RAG
import { Router, Request, Response } from 'express';
import { queryRAG } from '../services/rag';

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
