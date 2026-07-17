import pool from '../config/db';
import * as settingService from '../services/setting.service';

export const getSubscriptions = async (userId: string) => {
  const isInvisible = await settingService.checkInvisibleMode(userId);

  if (isInvisible) {
    return [];
  }

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

export const updateSubscription = async (userId: string, subId: string, subData: any) => {
  const { subscription_name, cost, payment_day, start_date, is_trial } = subData;
  
  const result = await pool.query(
    `UPDATE subscriptions 
     SET subscription_name = $1, cost = $2, payment_day = $3, start_date = $4, is_trial = $5 
     WHERE id = $6 AND user_id = $7 
     RETURNING *`,
    [subscription_name, cost, payment_day, start_date, is_trial, subId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Subscription not found or unauthorized');
  }
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

export const clearAllSubscriptions = async (userId: string) => {
  const result = await pool.query(
    'DELETE FROM subscriptions WHERE user_id = $1 RETURNING *',
    [userId]
  );
  return result.rows;
}