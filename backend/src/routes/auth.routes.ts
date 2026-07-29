import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPasswordSubmit);
router.post('/reset-password-request', authController.resetPasswordRequest);

router.get('/google', authController.googleRedirect); 
router.get('/google/callback', authController.googleCallback);
router.get('/me', protect, authController.getMe);

router.delete('/delete-account', protect, authController.deleteAccount);

export default router;