import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000, 
});

pool.on('connect', () => {
  console.log('🔌 Neon DB bağlantı havuzu (Pool) başarıyla kuruldu.');
});

pool.on('error', (err) => {
  console.error('❌ Beklenmedik veritabanı havuzu hatası:', err);
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool
};