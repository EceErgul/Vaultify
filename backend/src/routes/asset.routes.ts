import { Router } from 'express';
import { getAssets, createAsset, deleteAsset } from '../controllers/asset.controller';
import { 
  getAssetById, 
  getAssetTransactions, 
  addTransaction, 
  deleteTransaction, 
  updateTransaction 
} from '../controllers/assetDetail.controller';
import { protect } from '../middlewares/auth.middleware';
import { analyzeAsset } from '../controllers/ai.controller';

const router = Router();

router.use(protect);

router.get('/', getAssets);
router.post('/', createAsset);

router.get('/:assetId/analyze', analyzeAsset);
router.get('/:id', getAssetById);
router.delete('/:id', deleteAsset);

router.get('/:assetId/transactions', getAssetTransactions);
router.post('/:assetId/transactions', addTransaction);
router.delete('/transactions/:txId', deleteTransaction);
router.put('/transactions/:txId', updateTransaction);

export default router;