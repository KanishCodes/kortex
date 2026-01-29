import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

// GET /api/documents?subjectId=...
router.get('/', async (req, res) => {
  const { subjectId } = req.query;

  if (!subjectId) {
    return res.status(400).json({ error: 'Missing subjectId' });
  }

  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, title, created_at')
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, documents });
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Delete associated chunks first (manual cascade if not set in DB)
    const { error: chunksError } = await supabase
      .from('chunks')
      .delete()
      .eq('document_id', id);

    if (chunksError) {
      console.warn('Error deleting chunks (might not exist):', chunksError);
    }

    // 2. Delete the document record
    const { error: docError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (docError) throw docError;

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
