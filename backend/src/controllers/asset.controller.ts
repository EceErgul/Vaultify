import { Request, Response, NextFunction } from 'express';
import * as assetService from '../services/asset.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { checkInvisibleMode } from '../services/setting.service';
import { getLivePrice } from '../services/market.service';
import pool from "../config/db"

export const getAssets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isInvisible = await checkInvisibleMode(req.userId!);
    if (isInvisible) return res.status(200).json({ success: true, data: [] });

    const assets = await assetService.getAssets(req.userId!);
    res.status(200).json({ success: true, data: assets });
  } catch (error) {
    next(error);
  }
};

export const getAssetById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isInvisible = await checkInvisibleMode(req.userId!);
    if (isInvisible) return res.status(200).json({ success: true, data: null });

    const asset = await assetService.getAssetById(req.userId!, req.params.id);
    res.status(200).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

export const createAsset = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const asset = await assetService.createAsset(req.userId!, req.body);
    const initialLivePrice = await getLivePrice(asset.asset_type, asset.asset_name) || 0;

    const updatedResult = await pool.query(
      'UPDATE assets SET live_unit_price = $1, fetched_at = NOW() WHERE id = $2 RETURNING *',
      [initialLivePrice, asset.id]
    );

    res.status(201).json({ success: true, data: updatedResult.rows[0] });
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