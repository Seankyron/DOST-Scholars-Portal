import type { Province, ScholarshipType, CurriculumConfig, Semester } from './scholar'; // Added Semester here
import type { SubmissionStatus, PTPPlan } from './services';
import type { ThesisAllowance } from './services';

export interface DashboardStats {
  totalScholars: number;
  activeScholars: number;
  graduatedScholars: number;
  terminatedScholars: number;
  gradeSubmissions: number;
  travelClearance: number;
  stipendReleased: number;
  scholarsByProvince: {
    province: Province;
    count: number;
  }[];
  scholarsByType: {
    type: ScholarshipType;
    count: number;
  }[];
  stipendByUniversity: {
    university: string;
    amount: number;
  }[];
}

export interface PendingAccount {
  id: string;
  email: string;
  firstName: string;
  surname: string;
  scholarshipType: ScholarshipType;
  university: string;
  program: string;
  dateSubmitted: string;
  accountInfo: any;
  scholarInfo: any;
  curriculumInfo: CurriculumConfig;
}

export interface EventBanner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export interface AdminScholarInfo {
  name: string;
  spas_id: string;
  email: string;
  contactNumber: string;
  dateOfBirth?: string;
  completeAddress?: string;
}

export interface AdminPlacementInfo {
  scholarshipType: ScholarshipType;
  batch: number;
  university: string;
  program: string;
}

export interface PTPRequestDetails {
  id: string;
  spas_id: string;
  type: 'Referral Letter' | 'Program Completion';
  scholarInfo: AdminScholarInfo;
  placementInfo: AdminPlacementInfo;
  submissionInfo: {
    dateSubmitted: string;
    status: SubmissionStatus;
    adminComment?: string;
    trainingYear?: number;
    plan?: PTPPlan;
    semester: Semester; // Now correctly imported
    academicYear: string;
  };
  files: {
    grades?: string;
    replySlip?: string;
    curriculum?: string;
    form126?: string;
    form127?: string;
    form128?: string;
    dtr?: string;
    certCompletion?: string;
  };
}

export interface ThesisRequestDetails extends ThesisAllowance {
  scholarInfo: {
    name: string;
    spas_id: string;
    email: string;
    contactNumber: string;
    program: string;
    university: string;
    scholarshipType: ScholarshipType | string;
    yearAwarded: number;
  };
}