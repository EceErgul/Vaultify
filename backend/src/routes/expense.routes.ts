import { Router } from 'express';
import { getExpenses, createExpense, deleteExpense } from '../controllers/expense.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getExpenses);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);

export default router;