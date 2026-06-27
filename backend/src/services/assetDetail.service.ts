import pool from '../config/db';

export const getAssetTransactions = async (userId: string, assetId: string) => {
  const result = await pool.query(
    `SELECT at.*
     FROM asset_transactions at
     JOIN assets a ON LOWER(a.id::text) = LOWER(at.asset_id::text) -- 🚀 Büyük/küçük harf ve tip riskini sıfırlıyoruz
     WHERE LOWER(at.asset_id::text) = LOWER($1::text) 
       AND LOWER(a.user_id::text) = LOWER($2::text)
     ORDER BY at.date DESC`,
    [assetId, userId]
  );
  return result.rows;
};

export const addTransaction = async (userId: string, assetId: string, transactionData: any) => {
  const { transaction_type, date, total_quantity, price_per_unit, total_value } = transactionData;

  const assetCheck = await pool.query('SELECT * FROM assets WHERE id = $1 AND user_id = $2', [assetId, userId]);
  if (assetCheck.rows.length === 0) {
    throw new Error('Asset not found or unauthorized');
  }

  const currentAsset = assetCheck.rows[0];
  let newQuantity = Number(currentAsset.total_quantity);
  let newCost = Number(currentAsset.total_cost);

  if (transaction_type === 'Alış') {
    newQuantity += Number(total_quantity);
    newCost += Number(total_value);
  } else if (transaction_type === 'Satış') {
    newQuantity -= Number(total_quantity);
    if (newQuantity < 0) {
      throw new Error('Insufficient asset quantity for sale');
    }
  }

  const client = await pool.pool.connect();
  try {
    await client.query('BEGIN');

    const txResult = await client.query(
      'INSERT INTO asset_transactions (asset_id, transaction_type, date, total_quantity, price_per_unit, total_value) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [assetId, transaction_type, date, total_quantity, price_per_unit, total_value]
    );

    await client.query(
      'UPDATE assets SET total_quantity = $1, total_cost = $2 WHERE id = $3',
      [newQuantity, newCost, assetId]
    );

    await client.query('COMMIT');
    return txResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteTransaction = async (userId: string, txId: string) => {
  const transactionCheck = await pool.query(
    `SELECT at.*
     FROM asset_transactions at
     JOIN assets a ON at.asset_id = a.id
     WHERE at.id = $1::uuid AND a.user_id = $2::uuid`,
    [txId, userId]
  );

  if (transactionCheck.rows.length === 0) {
    throw new Error('İşlem bulunamadı veya bu işleme erişim yetkiniz yok.');
  }

  const deletedResult = await pool.query(
    'DELETE FROM asset_transactions WHERE id = $1 RETURNING *',
    [txId]
  );

  return deletedResult.rows[0];
};

export const updateTransaction = async (userId: string, txId: string, body: any) => {
  const transactionCheck = await pool.query(
    `SELECT at.*
     FROM asset_transactions at
     JOIN assets a ON at.asset_id = a.id
     WHERE at.id = $1::uuid AND a.user_id = $2::uuid`,
    [txId, userId]
  );

  if (transactionCheck.rows.length === 0) {
    throw new Error('İşlem bulunamadı veya bu işleme erişim yetkiniz yok.');
  }

  const updatedResult = await pool.query(
    `UPDATE asset_transactions
     SET transaction_type = $1,
         date = $2,
         total_quantity = $3,
         price_per_unit = $4,
         total_value = $5
     WHERE id = $6
     RETURNING *`,
    [
      body.transactionType ?? body.transaction_type,
      body.date,
      body.totalQuantity ?? body.total_quantity,
      body.pricePerUnit ?? body.price_per_unit,
      body.totalValue ?? body.total_value,
      txId
    ]
  );

  return updatedResult.rows[0];
};