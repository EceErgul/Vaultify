import { Router, Request, Response } from 'express';
import { getSmartInsight } from '../services/ai.service';

const router = Router();

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { financeData } = req.body;
    
    if (!financeData) {
      return res.status(400).json({ success: false, message: 'Finansal veri bulunamadı.' });
    }

    const analysisResult = await getSmartInsight(financeData);
    return res.json({ success: true, analysis: analysisResult });
  } catch (error) {
    console.error("AI Router Hatası:", error);
    return res.status(500).json({ success: false, message: 'Sunucu tabanlı AI hatası.' });
  }
});

export default router;