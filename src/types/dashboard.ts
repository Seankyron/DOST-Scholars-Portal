export type ScholarStatus = 'Active' | 'Warning' | 'Suspended' | 'Graduated' | 'Terminated';
export type ScholarshipType = 'RA 7687' | 'Merit';

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