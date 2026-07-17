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
  | 'LOGIN_SUCCESS';

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

    default:
      return { subject: 'Bilgilendirme', html: '<p>İşleminiz başarıyla tamamlandı.</p>' };
  }
};