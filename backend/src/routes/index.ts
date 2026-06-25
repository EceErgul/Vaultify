import { Router } from 'express';
import authRoutes from './auth.routes';
import assetRoutes from './asset.routes';
import expenseRoutes from './expense.routes';
import incomeRoutes from './income.routes';
import settingRoutes from './setting.routes';
import subscriptionRoutes from './subscription.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);
router.use('/expenses', expenseRoutes);
router.use('/incomes', incomeRoutes);
router.use('/settings', settingRoutes);
router.use('/subscriptions', subscriptionRoutes);

export default router;