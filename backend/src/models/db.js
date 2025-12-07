import dotenv from 'dotenv';
dotenv.config();

const DATABASE_TYPE = process.env.DATABASE_TYPE || 'sqlite';

let dbModule;

if (DATABASE_TYPE === 'postgres') {
    console.log('🐘 Using PostgreSQL database');
    dbModule = await import('./db-postgres.js');
} else {
    console.log('📁 Using SQLite database (local development)');
    dbModule = await import('./db-sqlite.js');
}

// Export unified interface
export const { query, run, get } = dbModule;

// Export additional exports if they exist
export const db = dbModule.db || dbModule.pool;
export const saveDatabase = dbModule.saveDatabase || (() => {
    // No-op for PostgreSQL (auto-saves)
});
export const closePool = dbModule.closePool || (() => {
    // No-op for SQLite
});
