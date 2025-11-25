import type { Province, ScholarshipType, CurriculumConfig } from './scholar';
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

// --- NEW TYPES MOVED FROM PTP TABLE ---

export interface AdminScholarInfo {
  name: string;
  spas_id: string;
  email: string;
  contactNumber: string;
}

export interface AdminPlacementInfo {
  scholarshipType: ScholarshipType;
  batch: number;
  university: string;
  program: string;
}

export interface PTPRequestDetails {
  id: string;
  spas_id: AdminScholarInfo['spas_id'] ;
  type: 'Referral Letter' | 'Program Completion';
  scholarInfo: AdminScholarInfo;
  placementInfo: AdminPlacementInfo;
  submissionInfo: {
    dateSubmitted: string;
    status: SubmissionStatus;
    adminComment?: string;
    trainingYear?: number;
    plan?: PTPPlan;
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
    email: string;           // Added
    contactNumber: string;   // Added
    program: string;
    university: string;
    scholarshipType: ScholarshipType | string;
    yearAwarded: number;     // Added
  };
}