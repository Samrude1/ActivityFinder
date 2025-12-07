import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoritesController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getFavorites);
router.post('/', authMiddleware, addFavorite);
router.delete('/:activityId', authMiddleware, removeFavorite);

export default router;
