import { Request, Response, NextFunction } from 'express';
import { getEmailTemplate } from '../templates/emailTemplates';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendEmail } from '../utils/sendEmail';
import crypto from 'crypto';
import { sendNotificationIfEnabled } from '../services/notification.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, email, password } = req.body;
    const result = await authService.registerUser({ full_name, email, password });
    const welcomeTemplate = getEmailTemplate('WELCOME', { name: result.user.full_name });
    
    await sendNotificationIfEnabled(
      result.user.id,
      'email_notification',
      welcomeTemplate.subject,
      welcomeTemplate.html
    );

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    
    const loginTemplate = getEmailTemplate('LOGIN_SUCCESS', { name: result.user.full_name });
    
    await sendNotificationIfEnabled(
      result.user.id,
      'login_notifications',
      loginTemplate.subject,
      loginTemplate.html
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const user = await authService.getUserProfile(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Lütfen e-posta adresinizi giriniz.' });
    }

    const resetToken = crypto.randomBytes(16).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await authService.storeResetToken(email, resetToken, expires);

    const resetUrl = `http://localhost:5173/new-password?token=${resetToken}`;
    const template = getEmailTemplate('PASSWORD_RESET', { link: resetUrl });

    await sendEmail({
      email: email,
      subject: template.subject,
      message: template.html,
    });

    res.status(200).json({ 
      success: true, 
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize başarıyla gönderildi.' 
    });
  } catch (error) {
    console.error("Forgot password hatası:", error);
    next(error);
  }
};

export const resetPasswordSubmit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    const user = await authService.resetUserPassword(token, newPassword);
    const template = getEmailTemplate('PASSWORD_CHANGED', {});

    await sendNotificationIfEnabled(
      user.id,
      'password_changed_notification', 
      template.subject,
      template.html
    );

    res.status(200).json({ success: true, message: 'Şifreniz güncellendi.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Hata oluştu.' });
  }
};

export const resetPasswordRequest = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log("Şifre sıfırlama isteği alındı:", email);
    res.status(200).json({ success: true, message: "E-posta gönderildi." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
};