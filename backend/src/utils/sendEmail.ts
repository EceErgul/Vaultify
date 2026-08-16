import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const emailLower = options.email.toLowerCase();
  
  if (
    process.env.DISABLE_EMAILS === 'true' || 
    process.env.NODE_ENV === 'test' || 
    emailLower.includes('vaultify.com') || 
    emailLower.includes('asset_user_') ||
    emailLower.includes('example.com') ||
    emailLower.includes('test') ||
    emailLower.includes('jest')
  ) {
    console.log(`[TEST MOCK] E-posta gönderimi engellendi. Alıcı: ${options.email}`);
    return;
  }

  try {
    await resend.emails.send({
      from: 'Vaultify <onboarding@resend.dev>',
      to: options.email,
      subject: options.subject,
      html: options.message,
    });
    console.log(`Email başarıyla gönderildi: ${options.email}`);
  } catch (error) {
    console.error("Email Gönderim Hatası:", error);
  }
};