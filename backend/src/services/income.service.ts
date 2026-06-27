import pool from '../config/db';

export const getIncomes = async (userId: string) => {
  const result = await pool.query(
    'SELECT * FROM incomes WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );
  return result.rows;
};

export const createIncome = async (userId: string, incomeData: any) => {
  const { income_name, income_category, income_amount, date } = incomeData;
  const result = await pool.query(
    'INSERT INTO incomes (user_id, income_name, income_category, income_amount, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, income_name, income_category, income_amount, date]
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
  const { income_name, income_category, income_amount, date } = incomeData;
  
  const result = await pool.query(
    `UPDATE incomes 
     SET income_name = $1, 
         income_category = $2, 
         income_amount = $3, 
         date = $4 
     WHERE id = $5 AND user_id = $6 
     RETURNING *`,
    [income_name, income_category, income_amount, date, incomeId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Income record not found or unauthorized');
  }
  return result.rows[0];
};