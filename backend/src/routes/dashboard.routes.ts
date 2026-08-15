import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', protect, DashboardController.getDashboard);

export default router;