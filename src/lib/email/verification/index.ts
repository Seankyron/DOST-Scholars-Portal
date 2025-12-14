// src/lib/email/verification/index.ts
import { mainTransporter } from '../providers'; // Assuming you set this up in previous steps
import { getApprovalTemplate, getRejectionTemplate } from './template';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const sendScholarApprovalEmail = async (to: string, firstName: string) => {
  try {
    const htmlContent = getApprovalTemplate(firstName, `${BASE_URL}/login`);
    
    await mainTransporter.sendMail({
      from: '"DOST-SEI Portal" <no-reply@dost.gov.ph>',
      to,
      subject: '🎉 Congratulations! Your Scholar Account is Verified',
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send approval email:', error);
    return { success: false, error };
  }
};

export const sendScholarRejectionEmail = async (to: string, reason: string) => {
  try {
    const htmlContent = getRejectionTemplate(reason, `${BASE_URL}/signup`);
    
    await mainTransporter.sendMail({
      from: '"DOST-SEI Portal" <no-reply@dost.gov.ph>',
      to,
      subject: 'Action Required: Scholar Account Verification',
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send rejection email:', error);
    return { success: false, error };
  }
};