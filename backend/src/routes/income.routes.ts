import { Router } from 'express';
import { getIncomes, createIncome, deleteIncome, updateIncome } from '../controllers/income.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getIncomes);
router.post('/', createIncome);
router.delete('/:id', deleteIncome);
router.put('/:id', updateIncome);

export default router;