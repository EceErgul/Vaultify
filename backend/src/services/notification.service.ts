import db from '../config/db';
import { sendEmail } from '../utils/sendEmail';

export const sendNotificationIfEnabled = async (
  userId: string,
  settingKey: 
    | 'email_notification' 
    | 'trial_expiration_notification' 
    | 'security_new_login_notification' 
    | 'password_changed_notification' 
    | 'subscription_reminder_notification'
    | 'security_notifications'
    | 'login_notifications'
    | 'security_alert_notification',
  subject: string,
  message: string
) => {

  try {
    const query = `
      SELECT u.email, s.${settingKey}
      FROM users u
      JOIN settings s ON u.id = s.user_id
      WHERE u.id = $1
    `;
    
    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      console.log(`Kullanıcı bulunamadı veya ayar kaydı yok: ${userId}`);
      return;
    }

    const userSettings = result.rows[0];

    if (userSettings[settingKey] === true) {
      console.log(`Bildirim gönderiliyor (Key: ${settingKey})...`);
      
      await sendEmail({
        email: userSettings.email,
        subject: subject,
        message: message
      });
    } else {
      console.log(`Bildirim gönderilmedi: Kullanıcı '${settingKey}' özelliğini kapalı tutuyor.`);
    }
  } catch (error) {
    console.error("Notification Service Hatası:", error);
  }
};