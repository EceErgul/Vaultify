import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    family: 4 as any,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  } as any);

  const mailOptions = {
    from: `"Vaultify Destek" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    html: `<p>${options.message}</p>`,
  };

  await transporter.sendMail(mailOptions);
};