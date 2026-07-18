import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  },
  max: 30,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, 
});

pool.on('error', (err) => {
  console.error('❌ Beklenmedik veritabanı havuzu hatası:', err);
});

export default pool;