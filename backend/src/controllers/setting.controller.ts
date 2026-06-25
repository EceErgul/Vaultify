import { Response, NextFunction } from 'express';
import * as settingService from '../services/setting.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const settings = await settingService.updateSettings(req.userId!, req.body);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};