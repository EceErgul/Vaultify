import { Request, Response, NextFunction } from 'express';
import { getEmailTemplate } from '../templates/emailTemplates';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendEmail } from '../utils/sendEmail';
import crypto from 'crypto';
import { sendNotificationIfEnabled } from '../services/notification.service';
import axios from 'axios';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || process.env.API_URL || 'http://127.0.0.1:5000';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { full_name, email, password } = req.body;
    const result = await authService.registerUser({ full_name, email, password });
    const welcomeTemplate = getEmailTemplate('WELCOME', { name: result.user.full_name });

    sendNotificationIfEnabled(
      result.user.id,
      'email_notification',
      welcomeTemplate.subject,
      welcomeTemplate.html
    ).catch(err => console.error("Hoş geldin maili arka plan hatası:", err));

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("REGISTER ERROR DEBUG:", error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    const loginTemplate = getEmailTemplate('LOGIN_SUCCESS', { name: result.user.full_name });

    sendNotificationIfEnabled(
      result.user.id,
      'login_notifications',
      loginTemplate.subject,
      loginTemplate.html
    ).catch(err => console.error("Giriş maili arka plan hatası:", err));

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error("LOGIN ERROR DEBUG:", error);
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ success: false, message: error.message });
    }
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

    const resetUrl = `${FRONTEND_URL}/new-password?token=${resetToken}`;
    const template = getEmailTemplate('PASSWORD_RESET', { link: resetUrl });

    sendEmail({
      email: email,
      subject: template.subject,
      message: template.html,
    }).catch(err => console.error("Şifre sıfırlama maili arka plan hatası:", err));

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

    sendNotificationIfEnabled(
      user.id,
      'password_changed_notification', 
      template.subject,
      template.html
    ).catch(err => console.error("Şifre değişti maili arka plan hatası:", err));

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

export const googleRedirect = (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${BACKEND_URL}/api/auth/google/callback`;
  const scope = encodeURIComponent('email profile');
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  res.redirect(googleAuthUrl);
};

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Google yetkilendirme kodu bulunamadı.' });
    }

    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { email, name, picture } = userInfoResponse.data;

    const result = await authService.googleAuthService({
      email,
      full_name: name,
      profile_picture: picture,
    });

    if (result.isNew) {
      const welcomeTemplate = getEmailTemplate('WELCOME', { name: result.user.full_name });
      sendNotificationIfEnabled(
        result.user.id,
        'email_notification',
        welcomeTemplate.subject,
        welcomeTemplate.html
      ).catch(err => console.error("Google hoş geldin maili hatası:", err));
    } else {
      const loginTemplate = getEmailTemplate('LOGIN_SUCCESS', { name: result.user.full_name });
      sendNotificationIfEnabled(
        result.user.id,
        'login_notifications',
        loginTemplate.subject,
        loginTemplate.html
      ).catch(err => console.error("Google giriş maili hatası:", err));
    }

    res.redirect(`${FRONTEND_URL}/dashboard?token=${result.token}`);
  } catch (error) {
    console.error("Google Callback Hatası:", error);
    res.redirect(`${FRONTEND_URL}/login?error=google_failed`);
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    await authService.deleteUserAccount(userId);

    res.status(200).json({ 
      success: true, 
      message: 'Hesabınız ve tüm verileriniz kalıcı olarak silindi.' 
    });
  } catch (error) {
    next(error);
  }
};