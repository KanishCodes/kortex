// Subject Routes - Handle subject management
import { Router, Request, Response } from 'express';
import { supabase } from '../services/supabase';

const router = Router();

/**
 * GET /api/subjects
 * Get all subjects for a user
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        error: 'Invalid request: userId is required as query parameter'
      });
    }

    console.log(`📚 Fetching subjects for user: ${userId}`);

    const { data: subjects, error } = await supabase
      .from('subjects')
      .select('id, name, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch subjects: ${error.message}`);
    }

    console.log(`   ✅ Found ${subjects?.length || 0} subjects`);

    res.json({
      success: true,
      subjects: subjects || []
    });

  } catch (error: any) {
    console.error('❌ Get subjects error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch subjects',
      message: error.message
    });
  }
});

/**
 * POST /api/subjects
 * Create a new subject
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, userId } = req.body;

    // Validate inputs
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        error: 'Invalid request: name is required'
      });
    }

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        error: 'Invalid request: userId is required'
      });
    }

    console.log(`➕ Creating subject: "${name}" for user: ${userId}`);

    const { data: subject, error } = await supabase
      .from('subjects')
      .insert({
        name: name.trim(),
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create subject: ${error.message}`);
    }

    console.log(`   ✅ Created subject ID: ${subject.id}`);

    res.status(201).json({
      success: true,
      subject: {
        id: subject.id,
        name: subject.name,
        created_at: subject.created_at
      }
    });

  } catch (error: any) {
    console.error('❌ Create subject error:', error.message);
    res.status(500).json({
      error: 'Failed to create subject',
      message: error.message
    });
  }
});

/**
 * DELETE /api/subjects/:id
 * Delete a subject and all its documents/chunks
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'Invalid request: userId is required'
      });
    }

    console.log(`🗑️  Deleting subject: ${id}`);

    // Delete subject (cascades to documents and chunks)
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Ensure user owns this subject

    if (error) {
      throw new Error(`Failed to delete subject: ${error.message}`);
    }

    console.log(`   ✅ Subject deleted`);

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Delete subject error:', error.message);
    res.status(500).json({
      error: 'Failed to delete subject',
      message: error.message
    });
  }
});

export default router;
