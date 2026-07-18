import cron from 'node-cron';
import db from '../config/db';
import { sendNotificationIfEnabled } from '../services/notification.service';
import { getEmailTemplate } from '../templates/emailTemplates';

cron.schedule('0 12 * * *', async () => {
  console.log("Bildirim kontrolü başlatıldı...");

  const result = await db.query(`
    SELECT u.id, u.email, u.full_name, sub.subscription_name, sub.cost, sub.payment_day, sub.is_trial
    FROM users u
    JOIN subscriptions sub ON u.id = sub.user_id
    JOIN settings s ON u.id = s.user_id
  `);

  console.log("Sorgudan dönen toplam satır sayısı:", result.rows.length);
  
  if (result.rows.length === 0) {
      console.log("Uyarı: Veritabanında eşleşen kullanıcı/abonelik bulunamadı. Sorgu boş dönüyor.");
  }

  for (const sub of result.rows) {
    const today = new Date();
    const currentDay = today.getDate();
    
    let daysLeft = sub.payment_day - currentDay;
    if (daysLeft < 0) {
      daysLeft = 30 + daysLeft; 
    }

    console.log(`Kontrol ediliyor: ${sub.subscription_name} | Ödeme Günü: ${sub.payment_day} | Bugün: ${currentDay} | Kalan: ${daysLeft}`);

    if ([0, 1, 5].includes(daysLeft)) {
      console.log(`${sub.subscription_name} için ${daysLeft} gün kaldı.`);

      const template = getEmailTemplate('SUBSCRIPTION_REMINDER', {
          subscriptionName: sub.subscription_name,
          amount: sub.cost,
          daysLeft: daysLeft
      });

      await sendNotificationIfEnabled(
        sub.id,
        'email_notification',
        template.subject,
        template.html
      );
    }
  }
});