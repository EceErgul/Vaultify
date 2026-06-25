import pool from '../config/db';

export const getSubscriptions = async (userId: string) => {
  const result = await pool.query(
    'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY start_date DESC',
    [userId]
  );
  return result.rows;
};

export const createSubscription = async (userId: string, subData: any) => {
  const { subscription_name, cost, payment_day, start_date, is_trial } = subData;
  const result = await pool.query(
    'INSERT INTO subscriptions (user_id, subscription_name, cost, payment_day, start_date, is_trial) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [userId, subscription_name, cost, payment_day, start_date, is_trial]
  );
  return result.rows[0];
};

export const deleteSubscription = async (userId: string, subId: string) => {
  const result = await pool.query(
    'DELETE FROM subscriptions WHERE id = $1 AND user_id = $2 RETURNING *',
    [subId, userId]
  );
  if (result.rows.length === 0) {
    throw new Error('Subscription not found or unauthorized');
  }
  return result.rows[0];
};