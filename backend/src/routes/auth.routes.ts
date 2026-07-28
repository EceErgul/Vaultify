import { Router } from 'express';
import { register, login, getMe, forgotPassword, resetPasswordSubmit, resetPasswordRequest, googleRedirect, googleCallback} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleRedirect); 
router.get('/google/callback', googleCallback);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordSubmit);
router.post('/reset-password-request', resetPasswordRequest);
export default router;