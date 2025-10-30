import { format, formatDistance, formatRelative } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'MMMM dd, yyyy'): string {
  return format(new Date(date), formatStr);
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy hh:mm a');
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

export function formatRelativeDate(date: string | Date): string {
  return formatRelative(new Date(date), new Date());
}

export function getAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  
  // Academic year starts in June (month 6)
  if (month >= 6) {
    return `AY ${year} - ${year + 1}`;
  } else {
    return `AY ${year - 1} - ${year}`;
  }
}

export function getCurrentSemester(): string {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  
  // June-October: 1st Semester
  // November-March: 2nd Semester
  // April-May: Midyear
  if (month >= 6 && month <= 10) {
    return '1st Semester';
  } else if (month >= 11 || month <= 3) {
    return '2nd Semester';
  } else {
    return 'Midyear';
  }
}
