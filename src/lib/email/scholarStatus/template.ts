// src/lib/email/scholarStatus/templates.ts

export const getStatusUpdateTemplate = (
  name: string,
  newStatus: string,
  remarks?: string
) => {
  const isNegative = ['Suspended', 'Terminated', 'Rejected', 'Warning'].includes(newStatus);
  
  // Choose color and tone based on status
  const color = isNegative ? '#ef4444' : '#0267d1'; // Red for negative, Blue for positive
  const title = isNegative ? 'Important: Scholarship Status Update' : 'Scholarship Status Update';
  
  const statusBadge = `
    <span style="
      display: inline-block;
      padding: 6px 12px;
      background-color: ${isNegative ? '#fef2f2' : '#f0f9ff'};
      color: ${color};
      border: 1px solid ${isNegative ? '#fecaca' : '#b9e6fe'};
      border-radius: 9999px;
      font-weight: 600;
      font-size: 14px;
    ">
      ${newStatus}
    </span>
  `;

  return `
    <div style="font-family: -apple-system, 'Inter', 'Segoe UI', sans-serif; max-width: 600px; margin: 40px auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.6;">
      
      <h2 style="color: #0f172a; font-size: 24px; margin-top: 0;">
        DOST-SEI Scholars Portal
      </h2>

      <h3 style="color: #1e293b; font-size: 20px; margin-bottom: 24px;">
        ${title}
      </h3>

      <p style="color: #334155; font-size: 16px;">
        Dear ${name},
      </p>

      <p style="color: #334155; font-size: 16px;">
        Please be advised that your scholarship status has been updated to:
      </p>

      <div style="margin: 24px 0;">
        ${statusBadge}
      </div>

      ${
        remarks
          ? `<div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
              <p style="color: #64748b; font-size: 12px; font-weight: 600; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.05em;">Admin Remarks</p>
              <p style="color: #334155; font-size: 15px; margin: 0;">${remarks}</p>
            </div>`
          : ''
      }

      <p style="color: #334155; font-size: 16px;">
        ${
          isNegative
            ? 'Please log in to the portal immediately to view more details or contact your regional coordinator if you have any questions.'
            : 'You may log in to the portal to view your updated profile.'
        }
      </p>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
         style="display: inline-block; margin: 24px 0; padding: 14px 24px; background-color: ${color}; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
        Open Scholars Portal
      </a>
      
      <p style="color: #475569; font-size: 14px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 24px;">
        Regards,<br>
        The DOST-SEI CALABARZON Team
      </p>

    </div>
  `;
};