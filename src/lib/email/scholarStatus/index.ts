// src/lib/email/scholarStatus/index.ts
import { mainTransporter } from '../providers';
import { getStatusUpdateTemplate } from './template';

export const sendScholarStatusEmail = async (
  to: string,
  name: string,
  newStatus: string,
  remarks?: string
) => {
  const htmlContent = getStatusUpdateTemplate(name, newStatus, remarks);

  try {
    await mainTransporter.sendMail({
      from: process.env.SMTP_FROM || '"DOST-SEI Portal" <no-reply@dost.gov.ph>',
      to,
      subject: `Scholarship Status Update: ${newStatus}`,
      html: htmlContent,
    });
    console.log(`Status email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send status email:', error);
    return { success: false, error };
  }
};