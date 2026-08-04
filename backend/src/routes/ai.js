import express from 'express';
import { generateAiItinerary } from '../services/aiConcierge.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

// In-memory usage tracker for free-tier / unauthenticated AI prompts (3 prompts / day per IP / User)
const USAGE_TRACKER = new Map();
const DAILY_LIMIT_FREE = 3;

function checkAndIncrementLimit(identifier) {
    const today = new Date().toISOString().split('T')[0];
    const key = `${identifier}_${today}`;
    const current = USAGE_TRACKER.get(key) || 0;

    if (current >= DAILY_LIMIT_FREE) {
        return { allowed: false, current, limit: DAILY_LIMIT_FREE };
    }

    USAGE_TRACKER.set(key, current + 1);
    return { allowed: true, current: current + 1, limit: DAILY_LIMIT_FREE };
}

/**
 * POST /api/ai/concierge
 * Generate personalized AI itinerary recommendations
 */
router.post('/concierge', optionalAuthMiddleware, async (req, res) => {
    try {
        const { location, userQuery, preferences, durationDays, availableActivities } = req.body;
        const user = req.user;
        const identifier = user?.id || req.ip || 'anonymous';
        const userTier = user?.tier || 'free';

        // Check rate limit for free tier
        if (userTier !== 'explorer' && userTier !== 'admin') {
            const limitCheck = checkAndIncrementLimit(identifier);
            if (!limitCheck.allowed) {
                return res.status(429).json({
                    error: 'Daily AI Concierge limit reached for Free Tier',
                    code: 'TIER_LIMIT_REACHED',
                    message: 'You have used your 3 free AI Concierge prompts for today. Upgrade to Explorer Tier for unlimited AI planning & custom lists!',
                    limit: DAILY_LIMIT_FREE,
                    upgradeRequired: true
                });
            }
        }

        console.log(`[aiRoute] Processing Concierge request for ${identifier} (${userTier} tier)`);

        const itinerary = await generateAiItinerary({
            location,
            userQuery,
            preferences,
            durationDays: durationDays || 1,
            availableActivities: availableActivities || []
        });

        res.json({
            success: true,
            userTier,
            itinerary
        });
    } catch (error) {
        console.error('[aiRoute] Concierge error:', error);
        res.status(500).json({ error: 'Failed to generate AI itinerary' });
    }
});

export default router;
