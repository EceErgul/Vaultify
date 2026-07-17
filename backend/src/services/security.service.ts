// backend/src/services/security.service.ts
import { sendNotificationIfEnabled } from './notification.service';
import { getEmailTemplate } from '../templates/emailTemplates';

export const triggerSecurityAlert = async (userId: string) => {
  const template = getEmailTemplate('SECURITY_ALERT', { date: new Date().toLocaleString() });

  await sendNotificationIfEnabled(
    userId,
    'security_alert_notification', 
    template.subject,
    template.html
  );
};