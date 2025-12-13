// src/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendRejectionEmail = async (to: string, reason: string) => {
  const registerUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup`;
  
  // HTML Template from previous conversation
  const htmlContent = `
    <div style="font-family: -apple-system, 'Inter', 'Segoe UI', sans-serif; max-width: 600px; margin: 40px auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.6;">
      <h2 style="color: #0f172a; font-size: 24px; margin-top: 0;">DOST-SEI Scholars Portal</h2>
      <h3 style="color: #1e293b; font-size: 20px; margin-bottom: 24px;">Account Verification Update</h3>
      <p style="color: #334155; font-size: 16px;">We have reviewed your registration for the DOST-SEI Scholars Portal.</p>
      <p style="color: #334155; font-size: 16px;">We regret to inform you that your account verification request has been <strong>declined</strong> by the administrator.</p>

      <a href="${registerUrl}" style="display: inline-block; margin: 24px 0; padding: 14px 24px; background-color: #0267d1; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">Register Again</a>

      <p style="color: #475569; font-size: 14px; margin-top: 32px;"><strong>What's next?</strong></p>
      <p style="color: #475569; font-size: 14px;">Please <strong>sign up again</strong> using the correct documents and details.</p>

      <p style="color: #475569; font-size: 14px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 24px;">If you believe this decision was made in error, please reply to this email or contact your regional coordinator.</p>
      <p style="color: #475569; font-size: 14px; margin-top: 24px;">Regards,<br>The DOST-SEI CALABARZON Team</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'DOST-SEI Portal: Account Verification Declined',
      html: htmlContent,
    });
    console.log(`Rejection email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // We don't throw here to ensure the loop in the route continues for other users
  }
};