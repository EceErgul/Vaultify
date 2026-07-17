import cron from 'node-cron';
import db from '../config/db';
import { sendNotificationIfEnabled } from '../services/notification.service';

cron.schedule('0 0 * * *', async () => {
  console.log("Bildirim kontrolü başlatıldı...");

  const result = await db.query(`
    SELECT u.id, u.email, u.full_name, u.renewal_date, u.trial_end_date, 
           u.sub_name, u.price, 
           s.email_notification, s.trial_expiration_notification 
    FROM users u
    JOIN settings s ON u.id = s.user_id
  `);

  for (const user of result.rows) {
    const today = new Date();

    if (user.renewal_date) {
      const renewalDays = calculateDays(user.renewal_date, today);
      if (user.email_notification && [5, 2, 0].includes(renewalDays)) {
        await sendNotificationIfEnabled(
          user.id,
          'email_notification',
          'Abonelik Tarihiniz Yaklaşmakta!',
          `Merhaba ${user.full_name}, abonelik tarihinizın bitmesine ${renewalDays === 0 ? 'bugün' : renewalDays + ' gün'} kaldı.`
        );
      }
    }

    if (user.trial_end_date) {
      const trialDays = calculateDays(user.trial_end_date, today);
      if (user.trial_expiration_notification && [5, 2, 0].includes(trialDays)) {
        await sendNotificationIfEnabled(
          user.id,
          'trial_expiration_notification',
          'Deneme Sürümünüz Bitiyor!',
          `Merhaba ${user.full_name}, deneme sürümünüzün bitmesine ${trialDays === 0 ? 'bugün' : trialDays + ' gün'} kaldı.`
        );
      }
    }
  }
});

function calculateDays(targetDate: Date, today: Date) {
  const diff = new Date(targetDate).getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}