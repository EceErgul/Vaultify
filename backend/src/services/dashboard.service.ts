import pool from '../config/db';

export class DashboardService {
 
  static async getDashboardData(userId: string) {
    try {
      const [
        userResult,
        assetsResult,
        expensesResult,
        incomesResult,
        subscriptionsResult,
        settingsResult
      ] = await Promise.all([
        pool.query('SELECT id, full_name, email FROM users WHERE id = $1', [userId]),
        pool.query('SELECT * FROM assets WHERE user_id = $1', [userId]),
        pool.query('SELECT * FROM expenses WHERE user_id = $1', [userId]),
        pool.query('SELECT * FROM incomes WHERE user_id = $1', [userId]),
        pool.query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]),
        pool.query('SELECT * FROM settings WHERE user_id = $1', [userId]),
      ]);

      return {
        user: userResult.rows[0] || null,
        assets: assetsResult.rows,
        expenses: expensesResult.rows,
        incomes: incomesResult.rows,
        subscriptions: subscriptionsResult.rows,
        settings: settingsResult.rows[0] || null,
      };
    } catch (error) {
      console.error('❌ Dashboard Servis Hatası:', error);
      throw new Error('Dashboard verileri alınırken bir veritabanı hatası oluştu.');
    }
  }
}