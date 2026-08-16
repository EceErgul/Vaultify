import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  if (
    process.env.DISABLE_EMAILS === 'true' || 
    process.env.NODE_ENV === 'test' || 
    options.email.includes('vaultify.com') || 
    options.email.includes('asset_user_')
  ) {
    console.log(`[TEST MOCK] E-posta gönderimi engellendi. Alıcı: ${options.email}`);
    return;
  }

  console.log("SMTP Config:", { 
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT, 
    user: process.env.SMTP_USER 
  });

  const transportConfig: SMTPTransport.Options & { family?: number } = {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, 
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    family: 4,
  };

  try {
    const transporter = nodemailer.createTransport(transportConfig);

    const mailOptions = {
      from: `"Vaultify Destek" <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email başarıyla gönderildi: ${options.email}`);
  } catch (error) {
    console.error("Email Gönderim Hatası:", error);
  }
};