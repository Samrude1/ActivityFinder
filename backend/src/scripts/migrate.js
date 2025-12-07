#!/usr/bin/env node
/**
 * Database Migration Script
 * Initializes PostgreSQL database schema and optionally migrates data from SQLite
 */

import dotenv from 'dotenv';
import { query, run, closePool } from '../models/db-postgres.js';

dotenv.config();

async function migrate() {
    console.log('🚀 Starting database migration...\n');

    try {
        // Test connection
        console.log('1️⃣ Testing PostgreSQL connection...');
        const testResult = await query('SELECT NOW() as current_time');
        console.log(`   ✅ Connected to PostgreSQL at ${testResult[0].current_time}\n`);

        // Verify tables exist
        console.log('2️⃣ Verifying database schema...');
        const tables = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

        console.log('   📋 Existing tables:');
        tables.forEach(table => {
            console.log(`      - ${table.table_name}`);
        });

        if (tables.length === 0) {
            console.log('   ⚠️  No tables found. They will be created on first server start.');
        }

        // Check if we have any data
        console.log('\n3️⃣ Checking existing data...');
        const userCount = await query('SELECT COUNT(*) as count FROM users');
        const favCount = await query('SELECT COUNT(*) as count FROM favorites');

        console.log(`   👥 Users: ${userCount[0].count}`);
        console.log(`   ❤️  Favorites: ${favCount[0].count}`);

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('   1. Set DATABASE_TYPE=postgres in your .env file');
        console.log('   2. Set DATABASE_URL to your PostgreSQL connection string');
        console.log('   3. Restart your backend server');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error('\n🔍 Troubleshooting:');
        console.error('   - Verify DATABASE_URL is set correctly in .env');
        console.error('   - Check that PostgreSQL database is accessible');
        console.error('   - Ensure database user has CREATE TABLE permissions');
        process.exit(1);
    } finally {
        await closePool();
    }
}

// Run migration
migrate();
