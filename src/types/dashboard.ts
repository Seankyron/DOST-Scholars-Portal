export type ScholarStatus = 
  | 'Active' 
  | 'Warning' 
  | '2nd Warning' 
  | 'Suspended' 
  | 'Graduated' 
  | 'Terminated' 
  | 'On hold';
// UPDATED: Now includes all 5 types
export type ScholarshipType = 
  | 'RA 7687' 
  | 'Merit' 
  | 'JLSS, RA 7687' 
  | 'JLSS, Merit' 
  | 'JLSS, RA 10612';

export interface ProvinceStats {
  province: string;
  total: number;
  stipendReleased: number;
  status: Record<ScholarStatus, number>; 
  type: Record<ScholarshipType, number>;   
}

export interface ServiceStats {
  id: string;
  name: string;
  newPending: number;      
  resubmitPending: number; 
  waitingOnScholar: number;
  approved: number;
  rejected: number;
}

export interface DashboardData {
  kpi: {
    totalScholars: number;
    stipendReleased: number;
    urgentPending: number;
  };
  provinceStats: ProvinceStats[];
  services: ServiceStats[];
}

export interface ProvinceStats {
  province: string;
  total: number;
  stipendReleased: number;
  status: Record<ScholarStatus, number>; // e.g. { Active: 100, Warning: 5 ... }
  type: Record<ScholarshipType, number>;   // e.g. { 'RA 7687': 50, Merit: 50 }
}

export interface ServiceStats {
  id: string;
  name: string;
  newPending: number;      // Blue Badge
  resubmitPending: number; // Orange Badge (Urgent)
  waitingOnScholar: number;
  approved: number;
  rejected: number;
}

export interface DashboardData {
  kpi: {
    totalScholars: number;
    stipendReleased: number;
    urgentPending: number;
  };
  provinceStats: ProvinceStats[];
  services: ServiceStats[];
}