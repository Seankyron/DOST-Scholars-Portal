export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 && cleaned.startsWith('09');
}

export function isValidScholarId(scholarId: string): boolean {
  // Format: YYYY-XXXX (e.g., 2022-1234)
  const scholarIdRegex = /^\d{4}-\d{4}$/;
  return scholarIdRegex.test(scholarId);
}