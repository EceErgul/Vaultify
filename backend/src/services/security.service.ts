import { sendNotificationIfEnabled } from './notification.service';
import { getEmailTemplate } from '../templates/emailTemplates';

export const triggerSecurityAlert = async (userId: string, userName: string) => {
  const template = getEmailTemplate('LOGIN_SUCCESS', { name: userName });

  await sendNotificationIfEnabled(
    userId,
    'login_notifications',
    template.subject,
    template.html
  );
};