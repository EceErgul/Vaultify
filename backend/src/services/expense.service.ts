import pool from '../config/db';

export const getExpenses = async (userId: string) => {
  const result = await pool.query(
    'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  return result.rows;
};

export const createExpense = async (userId: string, expenseData: any) => {
  const { expense_name, expense_category, payment_method, expenses_amount, date } = expenseData;
  const result = await pool.query(
    'INSERT INTO expenses (user_id, expense_name, expense_category, payment_method, expenses_amount, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [userId, expense_name, expense_category, payment_method, expenses_amount, date]
  );
  return result.rows[0];
};

export const deleteExpense = async (userId: string, expenseId: string) => {
  const result = await pool.query(
    'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
    [expenseId, userId]
  );
  if (result.rows.length === 0) {
    throw new Error('Expense not found or unauthorized');
  }
  return result.rows[0];
};