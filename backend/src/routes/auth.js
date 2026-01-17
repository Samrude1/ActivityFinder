import express from 'express';
import { register, login, getMe, updateTier } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { authLimiter } from '../middleware/security.js';

const router = express.Router();

// Apply stricter rate limiting to auth endpoints
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', authMiddleware, getMe);
router.put('/tier', authMiddleware, updateTier);

export default router;
