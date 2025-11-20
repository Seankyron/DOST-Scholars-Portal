import type { Semester } from './scholar';
import type { SubmissionStatus } from './services';

export interface SemesterAvailability {
  academicYear: string;
  isAvailable: boolean;
  isCurrent: boolean;
  isFuture: boolean;
  isPast: boolean;
  semester: Semester;
  status: SubmissionStatus;
<<<<<<< HEAD
  year: number;
  gradeFileKey: string | null;
  corFileKey: string | null;
=======
  academicYear?: string;
>>>>>>> merge
}