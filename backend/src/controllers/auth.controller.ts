import { Request, Response, NextFunction } from 'express';
import { getEmailTemplate } from '../templates/emailTemplates';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendEmail } from '../utils/sendEmail';
import crypto from 'crypto';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, email, password } = req.body;
    const result = await authService.registerUser({ full_name, email, password });
    const welcomeTemplate = getEmailTemplate('WELCOME', { name: result.user.full_name });
    
    sendEmail({
      email: result.user.email,
      subject: welcomeTemplate.subject,
      message: welcomeTemplate.html
    }).catch(err => console.error("Hoş geldin maili gönderilemedi:", err));

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
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

    const message = `
      <h3>Şifre Sıfırlama Talebi</h3>
      <p>Vaultify hesabınızın şifresini sıfırlamak için bir talepte bulundunuz.</p>
      <p>Şifrenizi yenilemek için lütfen aşağıdaki butona tıklayın (Bu link 1 saat geçerlidir):</p>
      <a href="${resetUrl}" target="_blank" style="display:inline-block; background-color: #333D50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold;">Şifremi Sıfırla</a>
      <p>Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayınız.</p>
    `;

    await sendEmail({
      email: email,
      subject: 'Vaultify - Şifre Sıfırlama Talebi',
      message: message,
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

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Geçersiz istek. Token veya şifre eksik.' });
    }

    await authService.resetUserPassword(token, newPassword);

    res.status(200).json({ 
      success: true, 
      message: 'Şifreniz başarıyla güncellendi. Giriş ekranına yönlendiriliyorsunuz.' 
    });
  } catch (error) {
    console.error("Şifre güncelleme hatası:", error);
    res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Bir hata oluştu.' });
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