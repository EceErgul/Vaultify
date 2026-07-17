import { Router, RequestHandler } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/fileStorage'; // Kendi middleware'ini kullan

const router = Router();

router.get('/profile', protect, userController.getProfile as RequestHandler);
router.put('/profile', protect, userController.updateSettings as RequestHandler);

router.post(
  '/profile/upload', 
  protect, 
  upload.single('profileImage') as unknown as RequestHandler, 
  userController.uploadProfileImage as RequestHandler
);

router.get('/settings', protect, userController.getSettings as RequestHandler);
router.put('/settings', protect, userController.updateSettings as RequestHandler);

export default router;