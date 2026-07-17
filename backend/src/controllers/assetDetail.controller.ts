import { Response, NextFunction } from 'express';
import * as assetDetailService from '../services/assetDetail.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { checkInvisibleMode } from '../services/setting.service';

export const getAssetTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isInvisible = await checkInvisibleMode(req.userId!);
    if (isInvisible) return res.status(200).json({ success: true, data: [] });

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

export const deleteTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await assetDetailService.deleteTransaction(req.userId!, req.params.txId);
    res.status(200).json({ success: true, message: 'İşlem başarıyla silindi' });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const updatedTransaction = await assetDetailService.updateTransaction(req.userId!, req.params.txId, req.body);
    res.status(200).json({ success: true, data: updatedTransaction });
  } catch (error) {
    next(error);
  }
};