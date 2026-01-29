import { Router, Request, Response } from 'express';
import { supabase } from '../services/supabase';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    // 1. Get Subject Count
    const { count: subjectCount, error: subjectError } = await supabase
      .from('subjects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (subjectError) throw subjectError;

    // 2. Get Document Count
    const { count: docCount, error: docError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (docError) throw docError;

    // 3. Get Query Count (from activity logs)
    const { count: queryCount, error: queryError } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('action_type', 'chat_query');

    if (queryError) throw queryError;

    res.json({
      success: true,
      stats: {
        subjects: subjectCount || 0,
        documents: docCount || 0,
        queries: queryCount || 0
      }
    });

  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/dashboard/activity
router.get('/activity', async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        id,
        action_type,
        created_at,
        metadata
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    // Transform for frontend
    const activities = data.map(log => {
      let topic = 'Unknown Activity';
      let subjectName = log.metadata?.subject_name || 'General';

      if (log.action_type === 'chat_query') {
        topic = 'Chat Query';
        subjectName = log.metadata?.subject_name || 'Study Session';
      } else if (log.action_type === 'upload_document') {
        topic = `Uploaded ${log.metadata?.title || 'Document'}`;
      } else if (log.action_type === 'create_subject') {
        topic = `Created Subject`;
        subjectName = log.metadata?.name || subjectName;
      }

      return {
        id: log.id,
        subject: subjectName,
        topic: topic,
        time: log.created_at // Frontend will format relative time
      };
    });

    res.json({ success: true, activities });

  } catch (error: any) {
    console.error('Activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

export default router;
