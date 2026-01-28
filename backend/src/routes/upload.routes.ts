// Upload Routes - Handle document uploads
import { Router, Request, Response } from 'express';
import multer from 'multer';
import { processDocument } from '../services/ingestion';

const router = Router();

// Configure multer for memory storage (files stored in RAM)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// POST /api/upload - Upload and process a PDF document
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    // Validate file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Validate required fields
    const { subjectId, userId } = req.body;

    if (!subjectId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: subjectId and userId'
      });
    }

    // Process the document
    console.log(`📤 Upload request: ${req.file.originalname}`);

    const result = await processDocument(
      req.file.buffer,
      req.file.originalname,
      subjectId,
      userId
    );

    res.status(200).json({
      success: true,
      documentId: result.documentId,
      chunksGenerated: result.chunksGenerated,
      title: result.title,
      message: `Successfully processed ${result.title} into ${result.chunksGenerated} chunks`
    });

  } catch (error: any) {
    console.error('❌ Upload error:', error.message);

    res.status(500).json({
      error: 'Upload failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/upload/status/:documentId
 * Get upload processing status
 */
router.get('/status/:documentId', async (req: Request, res: Response) => {
  const { documentId } = req.params;

  res.json({
    documentId,
    status: 'pending',
    message: 'Status tracking will be implemented in Phase 3',
  });
});

export default router;
