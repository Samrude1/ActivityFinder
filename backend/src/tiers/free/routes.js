import express from 'express';
import { searchActivities } from './features/search.js';
import { getFavorites, addFavorite, removeFavorite, getFavoriteCount } from './features/favorites.js';
import { enforceSearchLimit, getSearchCount } from './middleware/freeLimits.js';
import { authMiddleware, optionalAuthMiddleware } from '../../middleware/auth.js';

const router = express.Router();

// Search with daily limit enforcement (allow unauthenticated searches for guests)
router.post('/search', optionalAuthMiddleware, enforceSearchLimit, searchActivities);
router.get('/search-count', authMiddleware, getSearchCount);

// Favorites with quantity limit enforcement
router.get('/favorites', authMiddleware, getFavorites);
router.post('/favorites', authMiddleware, addFavorite);
router.delete('/favorites/:id', authMiddleware, removeFavorite);
router.get('/favorites/count', authMiddleware, getFavoriteCount);

export default router;
