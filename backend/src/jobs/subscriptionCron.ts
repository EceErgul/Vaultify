import cron from 'node-cron';
import db from '../config/db';
import { sendNotificationIfEnabled } from '../services/notification.service';
import { getEmailTemplate } from '../templates/emailTemplates';

cron.schedule('0 0 * * *', async () => {
  console.log("Bildirim kontrolü başlatıldı...");

  const result = await db.query(`
    SELECT u.id, u.email, u.full_name, u.renewal_date, u.trial_end_date, 
           u.sub_name, u.price 
    FROM users u
    JOIN settings s ON u.id = s.user_id
  `);

  for (const user of result.rows) {
    const today = new Date();

    if (user.renewal_date) {
      const renewalDays = calculateDays(user.renewal_date, today);
      if ([5, 2, 0].includes(renewalDays)) {
        const template = getEmailTemplate('SUBSCRIPTION_REMINDER', {
            subscriptionName: user.sub_name,
            amount: user.price,
            daysLeft: renewalDays
        });

        await sendNotificationIfEnabled(
          user.id,
          'email_notification',
          template.subject,
          template.html
        );
      }
    }

    if (user.trial_end_date) {
      const trialDays = calculateDays(user.trial_end_date, today);
      if ([5, 2, 0].includes(trialDays)) {
        const template = getEmailTemplate('TRIAL_EXPIRATION', {
            name: user.full_name,
        });

        await sendNotificationIfEnabled(
          user.id,
          'trial_expiration_notification',
          template.subject,
          template.html
        );
      }
    }
  }
});

function calculateDays(targetDate: Date, today: Date) {
  const diff = new Date(targetDate).getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}