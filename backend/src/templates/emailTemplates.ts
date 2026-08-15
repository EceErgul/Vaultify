interface SubscriptionData {
  subscriptionName: string;
  amount: number;
  daysLeft: number;
}
type TemplateType = 
  | 'TRIAL_EXPIRATION' 
  | 'WELCOME' 
  | 'SECURITY_ALERT' 
  | 'SUBSCRIPTION_REMINDER'
  | 'SECURITY_NEW_LOGIN'
  | 'PASSWORD_CHANGED'
  | 'LOGIN_SUCCESS'
  | 'PASSWORD_RESET'
  | 'GOOGLE_AUTH';

export const getEmailTemplate = (type: TemplateType, data: any) => {
  switch (type) {
    case 'TRIAL_EXPIRATION':
      return {
        subject: 'Deneme Süreniz Sona Eriyor!',
        html: `
          <h1>Merhaba ${data.name},</h1>
          <p>Deneme sürenizin bitmesine sadece 3 gün kaldı. Avantajlardan yararlanmaya devam etmek için <a href="${data.link}">buradan</a> üyeliğinizi yükseltebilirsiniz.</p>
        `
      };
      
    case 'SECURITY_NEW_LOGIN':
      return {
        subject: 'Yeni Giriş Algılandı',
        html: `
          <h1>Güvenlik Uyarısı</h1>
          <p>Hesabınıza <strong>${data.location || 'yeni bir cihazdan'}</strong> giriş yapıldı.</p>
          <p>Eğer bu siz değilseniz, lütfen şifrenizi hemen değiştirin.</p>
        `
      };

    case 'PASSWORD_CHANGED':
      return {
        subject: 'Şifreniz Değiştirildi',
        html: `
          <h1>Bilgilendirme</h1>
          <p>Hesabınızın şifresi başarıyla değiştirildi. Bu değişikliği siz yapmadıysanız lütfen bizimle iletişime geçin.</p>
        `
      };

    case 'LOGIN_SUCCESS':
      return {
        subject: 'Yeni Bir Giriş Tespit Edildi',
        html: `
          <h1>Merhaba ${data.name},</h1>
          <p>Hesabınıza yeni bir giriş yapıldı. Eğer bu işlemi siz yapmadıysanız lütfen hemen şifrenizi değiştirin.</p>
        `
      };

    case 'WELCOME':
      return {
        subject: 'Vaultify\'a Hoş Geldiniz!',
        html: `
          <h1>Merhaba ${data.name},</h1>
          <p>Vaultify'a hoş geldiniz! Hesabınızı güvenle kullanmaya başlayabilirsiniz.</p>
        `
      };

    case 'SUBSCRIPTION_REMINDER':
      if (data.daysLeft <= 0) {
        return {
          subject: `${data.subscriptionName} Ödemeniz Bugün!`,
          html: `
            <h1>Merhaba,</h1>
            <p><strong>${data.subscriptionName}</strong> aboneliğinizin ödeme günü geldi.</p>
            <p>Ödenecek tutar: <strong>${data.amount} TL</strong></p>
            <p>Lütfen ödemenizi tamamlayınız.</p>
          `
        };
      }
    
      return {
        subject: `${data.subscriptionName} Aboneliğiniz Hakkında`,
        html: `
          <h1>Merhaba,</h1>
          <p><strong>${data.subscriptionName}</strong> aboneliğinizin yenilenmesine <strong>${data.daysLeft} gün</strong> kaldı.</p>
          <p>Ödeme yapmanız gereken tarih yaklaşmaktadır.</p>
        `
      };

    case 'PASSWORD_RESET':
      return {
        subject: 'Vaultify - Şifre Sıfırlama Talebi',
        html: `
          <h3>Şifre Sıfırlama Talebi</h3>
          <p>Vaultify hesabınızın şifresini sıfırlamak için bir talepte bulundunuz.</p>
          <p>Şifrenizi yenilemek için lütfen aşağıdaki butona tıklayın (Bu link 1 saat geçerlidir):</p>
          <a href="${data.link}" target="_blank" style="display:inline-block; background-color: #333D50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold;">Şifremi Sıfırla</a>
          <p>Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayınız.</p>
        `
      };

    case 'GOOGLE_AUTH':
      return {
        subject: 'Vaultify\'a Google ile Başarıyla Giriş Yaptınız! 🚀',
        html: `
          <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f7f9fc; padding: 40px 0; color: #333D50;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <div style="background-color: #333D50; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">Vaultify'a Hoş Geldiniz!</h1>
              </div>

              <!-- Content -->
              <div style="padding: 32px 24px;">
                <p style="font-size: 16px; margin-top: 0;">Merhaba <strong>${data.name || 'Kullanıcı'}</strong>,</p>
                
                <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">
                  Google hesabınız başarıyla doğrulandı ve Vaultify platformunda sizin için güvenli bir hesap oluşturuldu. Artık tek tıkla hızlıca giriş yapabilir ve finansal verilerinizi yönetmeye başlayabilirsiniz.
                </p>

                <div style="text-align: center; margin: 32px 0;">
                  <a href="http://localhost:5173/dashboard" style="background-color: #333D50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px; display: inline-block;">
                    Panele Git
                  </a>
                </div>

                <p style="font-size: 14px; color: #718096; line-height: 1.5;">
                  Eğer bu işlemi siz gerçekleştirmediyseniz, lütfen derhal bizimle iletişime geçin veya şifrenizi kontrol edin.
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
                &copy; 2026 Vaultify. Tüm hakları saklıdır.
              </div>

            </div>
          </div>
        `,
      };

    default:
      return { subject: 'Bilgilendirme', html: '<p>İşleminiz başarıyla tamamlandı.</p>' };
  }
};