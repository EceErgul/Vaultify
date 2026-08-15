import { Response, NextFunction } from 'express';
import * as expenseService from '../services/expense.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { checkInvisibleMode } from '../services/setting.service';

export const getExpenses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isInvisible = await checkInvisibleMode(req.userId!);
    if (isInvisible) return res.status(200).json({ success: true, data: [] });

    const expenses = await expenseService.getExpenses(req.userId!);
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const expense = await expenseService.createExpense(req.userId!, req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const expense = await expenseService.deleteExpense(req.userId!, req.params.id);
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await expenseService.updateExpense(req.userId!, req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};