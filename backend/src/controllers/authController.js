import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query, run, get } from '../models/db.js';

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Check if user exists
        const existingUser = await get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user
        const userId = uuidv4();
        await run('INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
            [userId, username, email, passwordHash]);

        // Generate token
        const token = jwt.sign({ userId, tier: 'free' }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            token,
            user: {
                id: userId,
                username,
                email,
                tier: 'free'
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user.id, tier: user.tier }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                tier: user.tier
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await get('SELECT id, username, email, tier, created_at FROM users WHERE id = ?', [req.userId]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get favorites
        const favorites = await query('SELECT activity_data FROM favorites WHERE user_id = ?', [req.userId]);
        const favoritesData = favorites.map(f => JSON.parse(f.activity_data));

        res.json({
            user: {
                ...user,
                favorites: favoritesData
            }
        });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateTier = async (req, res) => {
    try {
        const { tier } = req.body;
        const validTiers = ['free', 'explorer'];

        if (!validTiers.includes(tier)) {
            return res.status(400).json({ error: 'Invalid tier' });
        }

        await run('UPDATE users SET tier = ? WHERE id = ?', [tier, req.userId]);

        const user = await get('SELECT id, username, email, tier FROM users WHERE id = ?', [req.userId]);

        // Generate a new token with the updated tier
        const token = jwt.sign(
            { userId: user.id, tier: user.tier },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                tier: user.tier
            }
        });
    } catch (error) {
        console.error('Update tier error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
