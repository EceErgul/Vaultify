import pool from '../config/db';
import * as settingService from '../services/setting.service';

export const getIncomes = async (userId: string) => {
  const isInvisible = await settingService.checkInvisibleMode(userId);
  if (isInvisible) return [];

  const result = await pool.query('SELECT * FROM incomes WHERE user_id = $1 ORDER BY date DESC', [userId]);
  return result.rows;
};

export const processRecurringIncomes = async (userId: string) => {
  const today = new Date();

  const recurringTemplates = await pool.query(
    'SELECT * FROM incomes WHERE user_id = $1 AND is_recurring = true',
    [userId]
  );

  for (const template of recurringTemplates.rows) {
    let lastGenDate = new Date(template.last_generated_date || template.date);
    const day = template.recurrence_day;

    while (true) {
      let nextYear = lastGenDate.getFullYear();
      let nextMonth = lastGenDate.getMonth() + 1;

      nextMonth++;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear++;
      }

      const targetDate = new Date(nextYear, nextMonth - 1, day);

      if (targetDate > today) {
        break;
      }

      const existingEntry = await pool.query(
        `SELECT id FROM incomes 
         WHERE user_id = $1 
         AND income_name = $2 
         AND EXTRACT(MONTH FROM date) = $3 
         AND EXTRACT(YEAR FROM date) = $4`,
        [userId, template.income_name, nextMonth, nextYear]
      );

      const formattedDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      if (existingEntry.rows.length === 0) {
        await pool.query(
          `INSERT INTO incomes (user_id, income_name, income_category, income_amount, date, is_recurring, recurrence_day, last_generated_date) 
           VALUES ($1, $2, $3, $4, $5, true, $6, $5)`,
          [userId, template.income_name, template.income_category, template.income_amount, formattedDate, day]
        );
      }

      await pool.query(
        'UPDATE incomes SET last_generated_date = $1 WHERE id = $2',
        [formattedDate, template.id]
      );

      lastGenDate = targetDate;
    }
  }
};

export const createIncome = async (userId: string, incomeData: any) => {
  const { income_name, income_category, income_amount, date, is_recurring, recurrence_day } = incomeData;
  const result = await pool.query(
    `INSERT INTO incomes (user_id, income_name, income_category, income_amount, date, is_recurring, recurrence_day) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [userId, income_name, income_category, income_amount, date, !!is_recurring, is_recurring ? recurrence_day : null]
  );
  return result.rows[0];
};

export const deleteIncome = async (userId: string, incomeId: string) => {
  const result = await pool.query(
    'DELETE FROM incomes WHERE id = $1 AND user_id = $2 RETURNING *',
    [incomeId, userId]
  );
  if (result.rows.length === 0) {
    throw new Error('Income record not found or unauthorized');
  }
  return result.rows[0];
};

export const updateIncome = async (userId: string, incomeId: string, incomeData: any) => {
  const { income_name, income_category, income_amount, date, is_recurring, recurrence_day } = incomeData;
  
  const result = await pool.query(
    `UPDATE incomes 
     SET income_name = $1, 
         income_category = $2, 
         income_amount = $3, 
         date = $4,
         is_recurring = $5,
         recurrence_day = $6 
     WHERE id = $7 AND user_id = $8 
     RETURNING *`,
    [income_name, income_category, income_amount, date, !!is_recurring, is_recurring ? recurrence_day : null, incomeId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Income record not found or unauthorized');
  }
  return result.rows[0];
};