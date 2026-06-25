import { Request, Response, NextFunction } from 'express';
import * as assetService from '../services/asset.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getAssets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const assets = await assetService.getAssets(req.userId!);
    res.status(200).json({ success: true, data: assets });
  } catch (error) {
    next(error);
  }
};

export const getAssetById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const asset = await assetService.getAssetById(req.userId!, req.params.id);
    res.status(200).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

export const createAsset = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const asset = await assetService.createAsset(req.userId!, req.body);
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

export const deleteAsset = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const asset = await assetService.deleteAsset(req.userId!, req.params.id);
    res.status(200).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};