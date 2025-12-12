export type ScholarStatus = 
  | 'Active' 
  | 'Warning' 
  | '2nd Warning' 
  | 'Suspended' 
  | 'Graduated' 
  | 'Terminated' 
  | 'On hold';

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
  pendingAmount: number; // Added this field as it is used in the dashboard
  status: Record<ScholarStatus, number>; 
  type: Record<ScholarshipType, number>;   
}

export interface UniversityStats {
  name: string;
  province: string;
  amount: number;
  pending: number;
  scholarCount: number;
}

export interface ServiceStats {
  id: string;
  name: string;
  topCategory: string; // Matches 'cat as "topCategory"' from SQL
  stats: {
    newPending: number;      
    resubmitPending: number; 
    waitingOnScholar: number;
    approved: number;
    rejected?: number;
  };
}

export interface DashboardData {
  kpi: {
    totalScholars: number;
    stipendReleased: number;
    urgentPending: number;
  };
  provinceStats: ProvinceStats[];
  universityStats: UniversityStats[];
  services: ServiceStats[];
}