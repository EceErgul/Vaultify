import { Router } from 'express';
import { getAssets, getAssetById, createAsset, deleteAsset } from '../controllers/asset.controller';
import { getAssetTransactions, addTransaction } from '../controllers/assetDetail.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getAssets);
router.get('/:id', getAssetById);
router.post('/', createAsset);
router.delete('/:id', deleteAsset);

router.get('/:assetId/transactions', getAssetTransactions);
router.post('/:assetId/transactions', addTransaction);

export default router;