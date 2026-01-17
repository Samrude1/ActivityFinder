import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';
import explorerRoutes from './tiers/explorer/routes.js';
import freeRoutes from './tiers/free/routes.js';
import { authMiddleware } from './middleware/auth.js';
import './models/db.js'; // Initialize database
import { helmetConfig, apiLimiter, getCorsOptions } from './middleware/security.js';
import { closePool } from './models/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const CLIENT_URL = process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:5174'];

// Security middleware
app.use(helmetConfig);

// CORS configuration
app.use(cors(getCorsOptions(CLIENT_URL)));

// Body parsing
app.use(express.json());

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

// Tier Routes
// Note: We mount explorer routes at /api because the module's router handles the specific subpaths (e.g. /lists, /export)
// This pattern allows the Explorer module to define its own API structure.
app.use('/api', authMiddleware, explorerRoutes);
app.use('/api/free', freeRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend is running',
        database: process.env.DATABASE_TYPE || 'sqlite',
        environment: process.env.NODE_ENV || 'development'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    // Don't leak error details in production
    const message = process.env.NODE_ENV === 'production'
        ? 'Something went wrong!'
        : err.message;

    res.status(err.status || 500).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.DATABASE_TYPE || 'SQLite'}`);
    console.log(`🔐 JWT Auth enabled`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security: Helmet + Rate Limiting enabled`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
        console.log('HTTP server closed');
        await closePool();
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    server.close(async () => {
        console.log('HTTP server closed');
        await closePool();
        process.exit(0);
    });
});
