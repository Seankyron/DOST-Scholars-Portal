// src/lib/email/send-notification.ts
import { mainTransporter } from './providers'; // Using your shared transporter
import { getStatusUpdateTemplate } from './general-template';

interface NotificationProps {
  to: string;
  firstName: string;
  serviceName: string;
  status: 'APPROVED' | 'RETURNED';
  comment?: string;
}

export const sendStatusEmail = async ({
  to,
  firstName,
  serviceName,
  status,
  comment,
}: NotificationProps) => {
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/scholar/dashboard`;
  const htmlContent = getStatusUpdateTemplate({
    userName: firstName,
    serviceName,
    status,
    comment,
    portalUrl,
  });

  const subject = status === 'APPROVED' 
    ? `✅ Approved: ${serviceName}` 
    : `⚠️ Action Required: ${serviceName}`;

  try {
    await mainTransporter.sendMail({
      from: '"DOST-SEI Notifications" <no-reply@dost.gov.ph>',
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to} for ${serviceName}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    // We don't throw error to prevent blocking the main API flow
  }
};