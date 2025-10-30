import { CurriculumConfig, YearLevel, Semester } from '@/types';

export function hasMidyear(config: CurriculumConfig, year: number): boolean {
  return config.midyearYears.includes(year);
}

export function getAvailableSemesters(config: CurriculumConfig, year: number): Semester[] {
  const semesters: Semester[] = ['1st Semester', '2nd Semester'];
  if (hasMidyear(config, year)) {
    semesters.push('Midyear');
  }
  return semesters;
}

export function isGradeSubmissionAvailable(
  config: CurriculumConfig,
  yearLevel: YearLevel,
  semester: Semester
): boolean {
  const yearNum = parseInt(yearLevel.split(' ')[0].replace(/\D/g, ''));
  
  // Always available for regular semesters
  if (semester !== 'Midyear') return true;
  
  // Check if midyear is available for this year
  return hasMidyear(config, yearNum);
}

export function isPTPEligible(config: CurriculumConfig, currentYear: number): boolean {
  // Scholar is eligible if they're in the year before OJT
  return currentYear === config.ojtYear - 1;
}

export function isThesisAvailable(config: CurriculumConfig, yearLevel: YearLevel): boolean {
  const yearNum = parseInt(yearLevel.split(' ')[0].replace(/\D/g, ''));
  return yearNum === config.thesisYear;
}

export function getYearNumber(yearLevel: YearLevel): number {
  return parseInt(yearLevel.split(' ')[0].replace(/\D/g, ''));
}
