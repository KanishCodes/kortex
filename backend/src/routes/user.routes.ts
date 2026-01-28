// User Routes - Get or create user by email (for OAuth)
import express from 'express';
import { getOrCreateUser } from '../services/user';

const router = express.Router();

/**
 * POST /api/users/get-or-create
 * Get or create user by email (called during OAuth sign-in)
 */
router.post('/get-or-create', async (req, res) => {
  try {
    const { email, name, image } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await getOrCreateUser(email, name, image);
    res.json(user);
  } catch (error: any) {
    console.error('Get or create user error:', error);
    res.status(500).json({
      error: 'Failed to get or create user',
      message: error.message,
    });
  }
});

export default router;
