import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as aiService from '../services/ai.service';
import * as assetDetailService from '../services/assetDetail.service';

export const analyzeAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { assetId } = req.params;
    const lang = req.headers['accept-language'] || 'tr';

    const asset = await assetDetailService.getAssetById(req.userId!, assetId);
    const txs = await assetDetailService.getAssetTransactions(req.userId!, assetId);

    const insight = await aiService.getSmartInsight(asset, txs, lang as string);
    res.status(200).json({ success: true, data: insight });
  } catch (error: any) {
    console.error("AI Analiz Hatası Detayı:", error); 
    res.status(500).json({ 
      success: false, 
      message: 'Analiz yapılamadı.', 
      errorDetail: error.message || String(error) 
    });
  }
};