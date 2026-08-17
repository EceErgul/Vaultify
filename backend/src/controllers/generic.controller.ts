import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { withRLS } from '../utils/db';

export const getTableData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { tableName } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Yetkilendirme hatası' });
    }

    const allowedTables = ['faturalar', 'assets', 'subscriptions', 'asset_transactions', 'maaslar', 'kiralar'];
    
    if (!allowedTables.includes(tableName)) {
      return res.status(403).json({ message: 'Geçersiz tablo adı!' });
    }

    const data = await withRLS(userId, async (client) => {
      const queryText = `SELECT * FROM ${tableName}`;
      const result = await client.query(queryText);
      return result.rows;
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};