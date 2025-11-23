import type { ServiceId } from '@/hooks/useServicePanel';
import type { YearLevel, Semester } from './scholar';

export type SubmissionStatus = 
  | 'Pending' 
  | 'Approved' 
  | 'Resubmit' 
  | 'Rejected'
  | 'Processing' 
  | 'Closed' 
  | 'Open' 
  | 'Not Available'
  | 'Released'
  | 'Resolved';

export type StipendPeriodStatus =
  | 'Released'
  | 'Processing'
  | 'On hold'
  | 'Not Available';

  export interface StipendSemesterAvailability {
  year: number;
  semester: Semester;
  status: StipendPeriodStatus;
  academicYear: string;
  isGradeApproved: boolean; 
}
// ..

export interface BaseSubmission {
  id: string;
  scholarId: string;
  status: SubmissionStatus;
  dateSubmitted: string;
  dateProcessed?: string;
  adminComment?: string;
}

export interface GradeSubmission extends BaseSubmission {
  yearLevel: YearLevel;
  semester: Semester;
  academicYear: string;
  registrationForm: string;
  registrationFormUrl?: string; // --- MODIFICATION: Added this property ---
  copyOfGrades: string;
  copyOfGradesUrl?: string; // --- MODIFICATION: Added this property ---
  curriculumFile?: string;
}

export interface StipendTracking extends BaseSubmission {
  yearLevel: YearLevel;
  semester: Semester;
  academicYear: string;
  expectedTotal: number;
  totalReceived: number;
  pendingAmount: number;
  releaseType: 'Released' | 'Pending' | 'On hold' | 'Processing';
  allowances: {
    month1?: number;
    month2?: number;
    month3?: number;
    month4?: number;
    month5?: number;
    clothing?: number;
    book?: number;
    graduation?: number;
  };
}

export type Allowance = {
  name: string;
  amount: number;
  status: 'Released' | 'Pending' | 'On hold' | 'Processing';
};


export type PTPPlan = 'undertake_ptp' | 'cannot_participate' | 'ojt_midyear_and_ptp';

export interface PracticalTrainingReferral extends BaseSubmission {
  trainingYear: number;
  plan: PTPPlan;
  replySlip: string;
  curriculum: string;
}

export interface PracticalTrainingCompletion extends BaseSubmission {
  trainingYear: number;
  form126: string;
  form127: string;
  form128: string;
  dtr: string;
  trainingCompletion: string;
}

export type ThesisPercentage = 90 | 10 | 100;

export interface ThesisAllowance extends BaseSubmission {
  percentage: ThesisPercentage;
  yearLevel: YearLevel;
  semester: Semester;
  academicYear: string;
  abstract?: string;
  approvalSheet?: string;
  registrationForm?: string;
  finalManuscript?: string;
}

export type TravelPurpose = 'Official Business Travel' | 'Other';

export interface TravelClearance extends BaseSubmission {
  purpose: TravelPurpose;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  requestLetter: string;
  guaranteeLetter?: string;
  deedOfUndertaking?: string;
  requestForm: string;
  coMakerEmployment?: string;
  coMakerId?: string;
  delayReason?: string;
}

export type ShiftingType = 'Shifting Course' | 'Transferring School' | 'Shifting Course & Transferring School';

export interface ShiftingTransferring extends BaseSubmission {
  applicationType: ShiftingType;
  newCourse?: string;
  newSchool?: string;
  effectivity: string;
  ojtNewCourse?: string;
  reason: string;
  applicationForm: string;
  certificationAdmission: string;
  certificationAccredited: string;
  certificationYearLevel: string;
  certificationGrades: string;
  approvedProgram: string;
}

export interface Reimbursement extends BaseSubmission {
  reimbursementType: string;
  reason: string;
  amount?: number;
  receipt: string;
}

export type LOAReason = 'Medical/Personal' | 'Exchange Student Program';

export interface LeaveOfAbsence extends BaseSubmission {
  reason: LOAReason;
  yearLevel: YearLevel;
  semester: Semester;
  academicYear: string;
  applicationForm: string;
  universityApproval: string;
  certificationGrades: string;
  medicalCertificate?: string;
  registrationForm?: string;
  proofOfAdmission?: string;
  supportingDocument?: string;
}

export interface RequestForm extends BaseSubmission {
  requestType: string;
  reason: string;
}

export interface SupportFeedback extends BaseSubmission {
  category: string;
  description: string;
  response?: string;
  dateResponded?: string;
}

export type RequestFormType = 
  | 'Certificate of Scholarship' 
  | 'Letter of Endorsement' 
  | 'Certificate of Grades' 
  | 'Certificate of Good Moral'
  | 'Financial Breakdown'
  | 'Other';

export interface RequestFormSubmission extends BaseSubmission {
  requestType: RequestFormType;
  reason: string;
  otherDetails?: string; // For addressee or specific instructions
}

export interface DashboardActivity {
  id: string | number;
  type: string; // The service category (e.g. "Grade Submission")
  title: string; // The main header (e.g. "3rd Year - 1st Sem")
  subtitle?: string; // Extra details (e.g. "AY 2024-2025" or "Singapore")
  status: SubmissionStatus;
  date: string; // ISO string
  serviceId: ServiceId; // For navigation handling
}