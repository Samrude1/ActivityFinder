import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
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

        console.log('✅ PostgreSQL database initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing PostgreSQL database:', error);
        throw error;
    } finally {
        client.release();
    }
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
        const result = await client.query(sql, params);
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
        await client.query(sql, params);
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
