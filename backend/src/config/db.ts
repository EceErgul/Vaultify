import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: process.env.DB_MAX_CONNECTIONS ? parseInt(process.env.DB_MAX_CONNECTIONS, 10) : 30,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('❌ Beklenmedik veritabanı havuzu hatası:', err);
});

export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    if (duration > 300) {
      console.warn(`⚠️ Yavaş Sorgu Tespit Edildi (${duration}ms):`, { text: text.trim(), params });
    }

    return res;
  } catch (error) {
    console.error('❌ Veritabanı Sorgu Hatası:', { text: text.trim(), error });
    throw error;
  }
};

export default pool;