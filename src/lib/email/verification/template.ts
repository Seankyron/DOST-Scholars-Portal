// src/lib/email/verification/templates.ts

export const getApprovalTemplate = (firstName: string, portalUrl: string) => `
<div style="font-family: -apple-system, 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin: 0;">Welcome to DOST-SEI!</h1>
    <p style="color: #64748b; margin-top: 8px;">Your account has been verified</p>
  </div>

  <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
    <p style="color: #166534; font-size: 14px; margin: 0; text-align: center;">
      <strong>✅ Verification Successful</strong>
    </p>
  </div>

  <p style="color: #334155; font-size: 16px; line-height: 1.6;">Hi <strong>${firstName}</strong>,</p>
  
  <p style="color: #334155; font-size: 16px; line-height: 1.6;">
    Great news! Your scholar profile and submitted documents have been reviewed and approved by our team. You now have full access to the Scholars Portal.
  </p>

  <p style="color: #334155; font-size: 16px; line-height: 1.6;">
    You can now log in to submit your grades, request clearances, and track your stipends.
  </p>

  <div style="text-align: center; margin: 32px 0;">
    <a href="${portalUrl}" style="display: inline-block; background-color: #0267d1; color: #ffffff; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px;">
      Access Dashboard
    </a>
  </div>

  <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 24px;">
    DOST-SEI Scholars Portal • CALABARZON Region
  </p>
</div>
`;

export const getRejectionTemplate = (reason: string, registerUrl: string) => `
<div style="font-family: -apple-system, 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
  <h2 style="color: #0f172a; font-size: 24px; margin-top: 0;">Account Update</h2>
  
  <p style="color: #334155; font-size: 16px; line-height: 1.6;">
    We have reviewed your registration for the DOST-SEI Scholars Portal.
  </p>

  <p style="color: #334155; font-size: 16px; line-height: 1.6;">
    We regret to inform you that your account verification request has been <strong style="color: #ef4444;">declined</strong>.
  </p>

  <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 4px;">
    <p style="color: #991b1b; font-size: 14px; margin: 0; font-weight: 700;">Reason for rejection:</p>
    <p style="color: #7f1d1d; font-size: 15px; margin: 8px 0 0 0;">${reason}</p>
  </div>

  <div style="margin-top: 24px;">
    <p style="color: #334155; font-size: 16px; font-weight: 600; margin-bottom: 12px;">What needs to be done?</p>
    <p style="color: #334155; font-size: 15px; margin: 0;">
      Please sign up again using the correct documents and details as requested above.
    </p>
  </div>

  <div style="text-align: left; margin: 24px 0;">
    <a href="${registerUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px;">
      Register Again
    </a>
  </div>
</div>
`;