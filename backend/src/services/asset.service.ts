import pool from '../config/db';
import { getLivePrice } from './market.service';
import * as settingService from '../services/setting.service';

export const getAssets = async (userId: string) => {
  const isInvisible = await settingService.checkInvisibleMode(userId);

  if (isInvisible) {
    return [];
  }

  const result = await pool.query(
    'SELECT * FROM assets WHERE user_id = $1 ORDER BY asset_name ASC',
    [userId]
  );
  return result.rows;
};

export const getAssetById = async (userId: string, assetId: string) => {
  try {
    const result = await pool.query(
      'SELECT * FROM assets WHERE id = $1 AND user_id = $2',
      [assetId, userId]
    );
    
    const asset = result.rows[0];
    if (!asset) return null;

    const liveUnitPrice = await getLivePrice(asset.asset_type, asset.asset_name) || 0;
    if (liveUnitPrice === 0) {
      console.warn(`⚠️ Uyarı: ${asset.asset_name} için fiyat alınamadı!`);
    }

    const totalQuantity = Number(asset.total_quantity || 0);
    const totalCost = Number(asset.total_cost || 0);
    
    const currentTotalValue = totalQuantity * liveUnitPrice;
    const netProfitLoss = currentTotalValue - totalCost;
    const profitLossPercentage = totalCost > 0 ? (netProfitLoss / totalCost) * 100 : 0;

    console.log(`\n=== 🔎 VAULTIFY DETAY TETİKLENDİ ===`);
    console.log(`Varlık Adı/Türü: ${asset.asset_name} [${asset.asset_type}]`);
    console.log(`API'den Dönen Canlı Fiyat: ${liveUnitPrice} ₺`);
    console.log(`Hesaplanan Güncel Değer: ${currentTotalValue} ₺`);
    console.log(`====================================\n`);

    return {
      id: asset.id,
      asset_name: asset.asset_name,
      asset_type: asset.asset_type,
      total_quantity: totalQuantity,
      total_cost: totalCost,
      live_unit_price: liveUnitPrice,
      current_total_value: currentTotalValue,
      net_profit_loss: netProfitLoss,
      profit_loss_percentage: profitLossPercentage,
      fetchedAt: new Date().toISOString()
    };
  } catch (error: any) {
    console.error("❌ getAssetById fonksiyonunda hata oluştu:", error.message);
    return null;
  }
};

export const createAsset = async (userId: string, assetData: any) => {
  const { asset_type, asset_name, total_quantity, total_cost } = assetData;
  const dbPool = (pool as any).pool || pool;
  const client = await dbPool.connect();
  
  try {
    await client.query('BEGIN');

    const existingAsset = await client.query(
      'SELECT * FROM assets WHERE user_id = $1 AND asset_name = $2 AND asset_type = $3',
      [userId, asset_name, asset_type]
    );

    let assetId: string;

    if (existingAsset.rows.length > 0) {
      const currentAsset = existingAsset.rows[0];
      assetId = currentAsset.id;

      const newQuantity = Number(currentAsset.total_quantity) + Number(total_quantity);
      const newCost = Number(currentAsset.total_cost) + Number(total_cost);

      await client.query(
        'UPDATE assets SET total_quantity = $1, total_cost = $2 WHERE id = $3',
        [newQuantity, newCost, assetId]
      );
    } else {
      const insertResult = await client.query(
        'INSERT INTO assets (user_id, asset_type, asset_name, total_quantity, total_cost) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [userId, asset_type, asset_name, total_quantity, total_cost]
      );
      assetId = insertResult.rows[0].id;
    }

    const qty = Number(total_quantity);
    const pricePerUnit = qty > 0 ? (Number(total_cost) / qty) : 0;
    
    await client.query(
      `INSERT INTO asset_transactions (asset_id, transaction_type, date, total_quantity, price_per_unit, total_value) 
       VALUES ($1, 'Alış', $2, $3, $4, $5)`,
      [assetId, new Date().toISOString().slice(0, 10), total_quantity, pricePerUnit, total_cost]
    );

    await client.query('COMMIT');
    
    const finalResult = await pool.query('SELECT * FROM assets WHERE id = $1', [assetId]);
    return finalResult.rows[0];

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteAsset = async (userId: string, assetId: string) => {
  const result = await pool.query(
    'DELETE FROM assets WHERE id = $1 AND user_id = $2 RETURNING *',
    [assetId, userId]
  );
  return result.rows[0];
};

const finalResultRows = async (assetId: string) => {
  const finalResult = await pool.query('SELECT * FROM assets WHERE id = $1', [assetId]);
  return finalResult.rows[0];
};