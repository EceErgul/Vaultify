import { Response, NextFunction } from 'express';
import * as subscriptionService from '../services/subscription.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getSubscriptions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subs = await subscriptionService.getSubscriptions(req.userId!);
    res.status(200).json({ success: true, data: subs });
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sub = await subscriptionService.createSubscription(req.userId!, req.body);
    res.status(201).json({ success: true, data: sub });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sub = await subscriptionService.deleteSubscription(req.userId!, req.params.id);
    res.status(200).json({ success: true, data: sub });
  } catch (error) {
    next(error);
  }
};