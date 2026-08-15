import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || (req as any).userId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Yetkilendirme bulunamadı.' });
        return;
      }

      const dashboardData = await DashboardService.getDashboardData(userId);

      res.status(200).json({
        success: true,
        data: dashboardData,
      });
    } catch (error: any) {
      console.error('❌ Dashboard Controller Hatası:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Sunucu hatası oluştu.',
      });
    }
  }
}