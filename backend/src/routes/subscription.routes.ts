import { Router } from 'express';
import { getSubscriptions, createSubscription, deleteSubscription, updateSubscription } from '../controllers/subscription.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getSubscriptions);
router.post('/', createSubscription);
router.delete('/:id', deleteSubscription);
router.put('/:id', updateSubscription);

export default router;