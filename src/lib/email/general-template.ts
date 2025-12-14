// src/lib/email/general-template.ts

type EmailStatus = 'APPROVED' | 'RETURNED';

interface TemplateParams {
  userName: string;
  serviceName: string; // e.g., "Grade Submission", "Travel Clearance"
  status: EmailStatus;
  comment?: string;
  portalUrl: string;
}

export const getStatusUpdateTemplate = ({
  userName,
  serviceName,
  status,
  comment,
  portalUrl,
}: TemplateParams) => {
  const isApproved = status === 'APPROVED';
  
  // Dynamic Colors and Text
  const mainColor = isApproved ? '#166534' : '#b45309'; // Green or Amber
  const bgColor = isApproved ? '#f0fdf4' : '#fffbeb';
  const borderColor = isApproved ? '#bbf7d0' : '#fde68a';
  const title = isApproved ? 'Request Approved' : 'Action Required';
  const message = isApproved 
    ? `Your <strong>${serviceName}</strong> has been successfully verified and approved.`
    : `Your <strong>${serviceName}</strong> has been returned for the following reason:`;

  return `
    <div style="font-family: -apple-system, 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
      
      <h2 style="color: #0f172a; margin-top: 0;">${title}</h2>
      
      <p style="color: #334155; font-size: 16px;">Hi <strong>${userName}</strong>,</p>

      <p style="color: #334155; font-size: 16px; line-height: 1.6;">
        ${message}
      </p>

      ${!isApproved && comment ? `
        <div style="background-color: ${bgColor}; border-left: 4px solid ${mainColor}; padding: 16px; margin: 24px 0; border-radius: 4px;">
          <p style="color: ${mainColor}; font-size: 14px; margin: 0; font-weight: 700;">Admin Comment:</p>
          <p style="color: #334155; font-size: 15px; margin: 8px 0 0 0;">${comment}</p>
        </div>
      ` : ''}

      <div style="text-align: center; margin: 32px 0;">
        <a href="${portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px;">
          View in Portal
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 24px;">
        DOST-SEI Scholars Portal
      </p>
    </div>
  `;
};