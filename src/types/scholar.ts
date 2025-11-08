export type ScholarshipType = 'RA 7687' | 'Merit' | 'JLSS, RA 7687' | 'JLSS, Merit' | 'JLSS, RA 10612';

export type ScholarStatus = 'Active' | 'Warning' | '2nd Warning' | 'Suspended' | 'Graduated' | 'Terminated' | 'On hold';

export type YearLevel = '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | '5th Year'|'Graduated';

export type Semester = '1st Semester' | '2nd Semester' | 'Midyear';

export type Province = 'Cavite' | 'Laguna' | 'Batangas' | 'Rizal' | 'Quezon';

export interface CurriculumConfig {
  midyearYears: number[];  // e.g., [1, 3] for 1st and 3rd year
  thesisYear: number;      // e.g., 4 for 4th year
  ojtYear: number;         // e.g., 3 for 3rd year
  ojtSemester: Semester;
  duration: 4 | 5;         // Course duration in years
}

export interface Scholar {
  id: string;
  email: string;
  scholarId: string;
  
  // Personal Information
  firstName: string;
  middleName?: string;
  surname: string;
  suffix?: string;
  contactNumber: string;
  dateOfBirth: string;
  completeAddress: string;
  
  // Scholarship Information
  scholarshipType: ScholarshipType;
  batch: number;
  yearAwarded: number;
  university: string;
  program: string;
  yearLevel: YearLevel;
  status: ScholarStatus;
  province: Province;
  
  // Curriculum Configuration
  curriculumConfig: CurriculumConfig;
  curriculumFile?: string;
  
  // Profile
  profileImage?: string;
  qrCode?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}