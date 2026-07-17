import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const transportConfig: SMTPTransport.Options = {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    secure: true, 
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  };

  try {
    const transporter = nodemailer.createTransport(transportConfig);

    const mailOptions = {
      from: `"Vaultify Destek" <${process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: `<p>${options.message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email başarıyla gönderildi: ${options.email}`);
  } catch (error) {
    console.error("Email Gönderim Hatası:", error);
  }
};