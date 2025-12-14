// src/lib/email/providers.ts
import nodemailer from 'nodemailer';

// Transporter for General/Admin notifications
export const mainTransporter = nodemailer.createTransport({
  host: process.env.SMTP_MAIN_HOST,
  port: Number(process.env.SMTP_MAIN_PORT),
  auth: {
    user: process.env.SMTP_MAIN_USER,
    pass: process.env.SMTP_MAIN_PASS,
  },
});

// Transporter specifically for Grades (e.g., grades@dost.gov.ph)
export const gradeTransporter = nodemailer.createTransport({
  host: process.env.SMTP_GRADES_HOST,
  port: Number(process.env.SMTP_GRADES_PORT),
  auth: {
    user: process.env.SMTP_GRADES_USER,
    pass: process.env.SMTP_GRADES_PASS,
  },
});

// Transporter for Finance/Stipends (e.g., finance@dost.gov.ph)
export const financeTransporter = nodemailer.createTransport({
  host: process.env.SMTP_FINANCE_HOST,
  port: Number(process.env.SMTP_FINANCE_PORT),
  auth: {
    user: process.env.SMTP_FINANCE_USER,
    pass: process.env.SMTP_FINANCE_PASS,
  },
});