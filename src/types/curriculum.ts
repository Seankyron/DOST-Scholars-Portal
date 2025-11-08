import type { Semester } from './scholar';
import type { SubmissionStatus } from './services';

export interface SemesterAvailability {
  year: number;
  semester: Semester;
  isAvailable: boolean;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
  status: SubmissionStatus;
}