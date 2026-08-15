import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendNotificationIfEnabled } from '../services/notification.service';
import { getEmailTemplate } from '../templates/emailTemplates';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    const isSuspicious = false; 
    if (isSuspicious) {
      const securityTemplate = getEmailTemplate('SECURITY_ALERT', { date: new Date().toLocaleString() });
      sendNotificationIfEnabled(result.user.id, 'security_notifications', securityTemplate.subject, securityTemplate.html)
        .catch(err => console.error("Güvenlik maili gönderilemedi:", err));
    }

    const loginTemplate = getEmailTemplate('LOGIN_SUCCESS', { name: result.user.full_name });
    sendNotificationIfEnabled(result.user.id, 'login_notifications', loginTemplate.subject, loginTemplate.html)
      .catch(err => console.error("Giriş maili gönderilemedi:", err));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};