// server_api/src/config/db.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create a new connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Use SSL in production, but not in a local dev environment
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Log on successful connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

// Log on connection error
pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;
