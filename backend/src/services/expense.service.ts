import pool from '../config/db';
import * as settingService from '../services/setting.service';

export const getExpenses = async (userId: string) => {
  const isInvisible = await settingService.checkInvisibleMode(userId);
  if (isInvisible) return [];

  const result = await pool.query(
    'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  return result.rows;
};

export const processRecurringExpenses = async (userId: string) => {
  const today = new Date();

  const recurringTemplates = await pool.query(
    'SELECT * FROM expenses WHERE user_id = $1 AND is_recurring = true',
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
        `SELECT id FROM expenses 
         WHERE user_id = $1 
         AND expense_name = $2 
         AND EXTRACT(MONTH FROM date) = $3 
         AND EXTRACT(YEAR FROM date) = $4`,
        [userId, template.expense_name, nextMonth, nextYear]
      );

      const formattedDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      if (existingEntry.rows.length === 0) {
        await pool.query(
          `INSERT INTO expenses (user_id, expense_name, expense_category, payment_method, expenses_amount, date, is_recurring, recurrence_day, last_generated_date) 
           VALUES ($1, $2, $3, $4, $5, $6, true, $7, $8)`,
          [userId, template.expense_name, template.expense_category, template.payment_method, template.expenses_amount, formattedDate, day, formattedDate]
        );
      }

      await pool.query(
        'UPDATE expenses SET last_generated_date = $1 WHERE id = $2',
        [formattedDate, template.id]
      );

      lastGenDate = targetDate;
    }
  }
};

export const createExpense = async (userId: string, expenseData: any) => {
  const { 
    expense_name, 
    expense_category, 
    payment_method, 
    expenses_amount, 
    date, 
    is_recurring, 
    recurrence_day 
  } = expenseData;

  const isRec = !!is_recurring;
  const recDay = isRec ? recurrence_day : null;
  const initialLastGen = isRec ? date : null;

  const result = await pool.query(
    `INSERT INTO expenses (user_id, expense_name, expense_category, payment_method, expenses_amount, date, is_recurring, recurrence_day, last_generated_date) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [userId, expense_name, expense_category, payment_method, expenses_amount, date, isRec, recDay, initialLastGen]
  );
  return result.rows[0];
};

export const deleteExpense = async (userId: string, expenseId: string) => {
  const result = await pool.query(
    'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
    [expenseId, userId]
  );
  if (result.rows.length === 0) throw new Error('Expense not found or unauthorized');
  return result.rows[0];
};

export const updateExpense = async (userId: string, expenseId: string, expenseData: any) => {
  const { 
    expense_name, 
    expense_category, 
    payment_method, 
    expenses_amount, 
    date, 
    is_recurring, 
    recurrence_day 
  } = expenseData;
  
  const isRec = !!is_recurring;
  const recDay = isRec ? recurrence_day : null;

  const result = await pool.query(
    `UPDATE expenses 
     SET expense_name = $1, 
         expense_category = $2, 
         payment_method = $3, 
         expenses_amount = $4, 
         date = $5,
         is_recurring = $6,
         recurrence_day = $7
     WHERE id = $8 AND user_id = $9 
     RETURNING *`,
    [expense_name, expense_category, payment_method, expenses_amount, date, isRec, recDay, expenseId, userId]
  );

  if (result.rows.length === 0) throw new Error('Expense not found or unauthorized');

  return result.rows[0];
};