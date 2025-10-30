export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPhoneNumber(phone: string): string {
  // Format: +63 912 345 6789
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('63')) {
    const number = cleaned.substring(2);
    return `+63 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
  }
  return phone;
}

export function formatName(scholar: { firstName: string; middleName?: string; surname: string; suffix?: string }): string {
  const { firstName, middleName, surname, suffix } = scholar;
  let name = `${firstName}`;
  if (middleName) name += ` ${middleName}`;
  name += ` ${surname}`;
  if (suffix) name += ` ${suffix}`;
  return name;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}