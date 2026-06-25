import { Response, NextFunction } from 'express';
import * as incomeService from '../services/income.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getIncomes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const incomes = await incomeService.getIncomes(req.userId!);
    res.status(200).json({ success: true, data: incomes });
  } catch (error) {
    next(error);
  }
};

export const createIncome = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const income = await incomeService.createIncome(req.userId!, req.body);
    res.status(201).json({ success: true, data: income });
  } catch (error) {
    next(error);
  }
};

export const deleteIncome = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const income = await incomeService.deleteIncome(req.userId!, req.params.id);
    res.status(200).json({ success: true, data: income });
  } catch (error) {
    next(error);
  }
};