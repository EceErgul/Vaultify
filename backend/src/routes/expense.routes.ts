import { Router } from 'express';
import { getExpenses, createExpense, deleteExpense, updateExpense } from '../controllers/expense.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getExpenses);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);
router.put('/:id', updateExpense);

export default router;