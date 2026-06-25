import { Response, NextFunction } from 'express';
import * as assetDetailService from '../services/assetDetail.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getAssetTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const transactions = await assetDetailService.getAssetTransactions(req.userId!, req.params.assetId);
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

export const addTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const transaction = await assetDetailService.addTransaction(req.userId!, req.params.assetId, req.body);
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};