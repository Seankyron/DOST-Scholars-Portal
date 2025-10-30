import type { Semester } from './scholar';

export interface SemesterAvailability {
  year: number;
  semester: Semester;
  isAvailable: boolean;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
}