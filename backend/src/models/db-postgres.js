import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('sslmode=require') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    max: 5, // Reduced for free tier limits
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 45000, // Increased to 45s to handle cold starts
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});

// Initialize database schema
async function initDatabase() {
    const client = await pool.connect();
    try {
        // Create users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                tier TEXT DEFAULT 'free',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Add tier column if it doesn't exist (for existing databases)
        await client.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free'
        `);

        // Create index on email for faster lookups
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
        `);

        // Create index on username for faster lookups
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
        `);

        // Create favorites table
        await client.query(`
            CREATE TABLE IF NOT EXISTS favorites (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                activity_data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Create index on user_id for faster favorites lookups
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)
        `);

        // Create custom_lists table for Explorer+ users
        await client.query(`
            CREATE TABLE IF NOT EXISTS custom_lists (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                icon TEXT DEFAULT '📋',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Create index on user_id for faster custom lists lookups
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_custom_lists_user_id ON custom_lists(user_id)
        `);

        // Create list_items table for storing activities in custom lists
        await client.query(`
            CREATE TABLE IF NOT EXISTS list_items (
                id TEXT PRIMARY KEY,
                list_id TEXT NOT NULL,
                activity_data TEXT NOT NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (list_id) REFERENCES custom_lists(id) ON DELETE CASCADE
            )
        `);

        // Create index on list_id for faster list items lookups
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_list_items_list_id ON list_items(list_id)
        `);

        // Create user_search_limits table for Free tier enforcement
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_search_limits (
                user_id TEXT PRIMARY KEY,
                search_count INTEGER DEFAULT 0,
                last_reset_date DATE DEFAULT CURRENT_DATE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Create Super User for testing
        const bcrypt = await import('bcrypt');
        const { v4: uuidv4 } = await import('uuid');
        const superPassword = 'Adventurer2025!';
        const saltRounds = 10;
        const passwordHash = await bcrypt.default.hash(superPassword, saltRounds);
        const superId = 'super-user-id-001';

        await client.query(`
            INSERT INTO users (id, username, email, password_hash, tier)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (email) DO UPDATE 
            SET tier = EXCLUDED.tier, password_hash = EXCLUDED.password_hash
        `, [superId, 'superuser', 'admin@activityfinder.com', passwordHash, 'explorer']);

        console.log('✅ PostgreSQL database initialized successfully');
        console.log('👤 Super user checked/updated: admin@activityfinder.com / Adventurer2025!');
    } catch (error) {
        console.error('❌ Error initializing PostgreSQL database:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Convert ? placeholders to $1, $2, etc. for PostgreSQL
 * @param {string} sql
 * @returns {string}
 */
function toPostgres(sql) {
    let paramCount = 1;
    return sql.replace(/\?/g, () => `$${paramCount++}`);
}

/**
 * Execute a query and return all results
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
async function query(sql, params = []) {
    const client = await pool.connect();
    try {
        const pgSql = toPostgres(sql);
        const result = await client.query(pgSql, params);
        return result.rows;
    } catch (error) {
        console.error('Query error:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Execute a query (INSERT, UPDATE, DELETE)
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<void>}
 */
async function run(sql, params = []) {
    const client = await pool.connect();
    try {
        const pgSql = toPostgres(sql);
        await client.query(pgSql, params);
    } catch (error) {
        console.error('Run error:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Get a single row from query results
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object|null>} First result or null
 */
async function get(sql, params = []) {
    const results = await query(sql, params);
    return results.length > 0 ? results[0] : null;
}

/**
 * Close the database pool (for graceful shutdown)
 */
async function closePool() {
    await pool.end();
    console.log('PostgreSQL pool closed');
}

// Initialize database on module load
await initDatabase();

export { pool, query, run, get, closePool };
