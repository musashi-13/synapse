import pg from 'pg';

import dotenv from 'dotenv';

import path from 'path';

import { fileURLToPath } from 'url';



// Required for ES modules to get __dirname

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



// Load .env from parent

dotenv.config({ path: path.join(__dirname, '..', '.env') });



const { Pool } = pg;



const pool = new Pool({

  connectionString: process.env.DATABASE_URL,

  ssl: {

    rejectUnauthorized: false,

  },

});



pool.on('connect', () => {

  console.log('✅ Connected to Supabase PostgreSQL');

});



pool.on('error', (err) => {

  console.error('❌ Unexpected error on idle client', err);

  process.exit(-1);

});



export default pool;