import cron from 'node-cron';
import pool from '../config/db';
import { getLivePrice } from '../services/market.service';

const updateAllAssetPrices = async () => {
  console.log('🔄 Varlık güncel fiyatları güncelleniyor...');
  try {
    const assetsResult = await pool.query('SELECT DISTINCT id, asset_name, asset_type FROM assets');

    for (const asset of assetsResult.rows) {
      const liveUnitPrice = await getLivePrice(asset.asset_type, asset.asset_name);

      if (liveUnitPrice > 0) {
        await pool.query(
          'UPDATE assets SET live_unit_price = $1, fetched_at = NOW() WHERE id = $2',
          [liveUnitPrice, asset.id]
        );
      }
    }
    console.log('✅ Varlık fiyatları başarıyla güncellendi.');
  } catch (error) {
    console.error('❌ Asset cron hatası:', error);
  }
};

updateAllAssetPrices();

cron.schedule('*/5 * * * *', updateAllAssetPrices);