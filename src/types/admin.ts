import type { Province, ScholarshipType, CurriculumConfig } from './scholar';

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
