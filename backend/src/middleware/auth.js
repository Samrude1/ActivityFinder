import jwt from 'jsonwebtoken';
import { get } from '../models/db.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch latest user info to ensure tier is up to date
        // This handles cases where user upgraded but token hasn't refreshed yet
        const user = await get('SELECT tier FROM users WHERE id = ?', [decoded.userId]);

        if (!user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }

        // Backward compatibility
        req.userId = decoded.userId;

        // New standardized user object for tier-specific features
        req.user = {
            id: decoded.userId,
            tier: user.tier || decoded.tier || 'free'
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};
