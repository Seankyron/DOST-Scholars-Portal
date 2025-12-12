'use client';

import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { DashboardStats } from '@/components/admin/dashboard/stats/DashboardStats';
import { ServiceGrid } from '@/components/admin/dashboard/service/ServiceGrid';

const getDashboardData = (year: string, semester: string) => {
  const isPastYear = year === '2023-2024';
  
  // MOCK DATA: In a real app, this would come from an API based on year/semester
  return {
    kpi: {
      totalScholars: isPastYear ? 980 : 1245,
      stipendReleased: isPastYear ? 12000000 : 15450000,
      urgentPending: isPastYear ? 0 : 18, 
    },
    
    provinceStats: [
      { 
        province: 'Cavite', 
        total: 450, 
        stipendReleased: 5000000, 
        pendingAmount: 1200000,
        status: { 
          'Active': 350, 
          'Warning': 30, 
          '2nd Warning': 10, 
          'Suspended': 10, 
          'On hold': 20, 
          'Graduated': 25, 
          'Terminated': 5 
        }, 
        type: { 
          'RA 7687': 200, 
          'Merit': 100, 
          'JLSS, RA 7687': 80, 
          'JLSS, Merit': 50, 
          'JLSS, RA 10612': 20 
        } 
      },
      { 
        province: 'Laguna', 
        total: 320, 
        stipendReleased: 4200000, 
        pendingAmount: 800000,
        status: { 
          'Active': 250, 
          'Warning': 20, 
          '2nd Warning': 5, 
          'Suspended': 5, 
          'On hold': 10, 
          'Graduated': 30, 
          'Terminated': 0 
        }, 
        type: { 
          'RA 7687': 150, 
          'Merit': 80, 
          'JLSS, RA 7687': 50, 
          'JLSS, Merit': 30, 
          'JLSS, RA 10612': 10 
        } 
      },
      { 
        province: 'Batangas', 
        total: 280, 
        stipendReleased: 3500000, 
        pendingAmount: 1500000,
        status: { 
          'Active': 220, 
          'Warning': 25, 
          '2nd Warning': 5, 
          'Suspended': 5, 
          'On hold': 5, 
          'Graduated': 20, 
          'Terminated': 0 
        }, 
        type: { 
          'RA 7687': 120, 
          'Merit': 60, 
          'JLSS, RA 7687': 60, 
          'JLSS, Merit': 20, 
          'JLSS, RA 10612': 20 
        } 
      },
      { 
        province: 'Rizal', 
        total: 110, 
        stipendReleased: 1850000, 
        pendingAmount: 50000,
        status: { 
          'Active': 90, 
          'Warning': 5, 
          '2nd Warning': 3, 
          'Suspended': 2, 
          'On hold': 5, 
          'Graduated': 5, 
          'Terminated': 0 
        }, 
        type: { 
          'RA 7687': 50, 
          'Merit': 20, 
          'JLSS, RA 7687': 20, 
          'JLSS, Merit': 10, 
          'JLSS, RA 10612': 10 
        } 
      },
      { 
        province: 'Quezon', 
        total: 85, 
        stipendReleased: 900000, 
        pendingAmount: 450000,
        status: { 
          'Active': 60, 
          'Warning': 5, 
          '2nd Warning': 2, 
          'Suspended': 3, 
          'On hold': 5, 
          'Graduated': 10, 
          'Terminated': 0 
        }, 
        type: { 
          'RA 7687': 40, 
          'Merit': 15, 
          'JLSS, RA 7687': 15, 
          'JLSS, Merit': 10, 
          'JLSS, RA 10612': 5 
        } 
      },
    ],
    
    universityStats: [
      { name: 'Cavite State University', province: 'Cavite', amount: 3000000, pending: 500000, scholarCount: 200 },
      { name: 'De La Salle - Dasmariñas', province: 'Cavite', amount: 2000000, pending: 700000, scholarCount: 150 },
      { name: 'UP Los Baños', province: 'Laguna', amount: 3200000, pending: 0, scholarCount: 210 },
      { name: 'Laguna State Poly U', province: 'Laguna', amount: 1000000, pending: 800000, scholarCount: 80 },
      { name: 'Batangas State University', province: 'Batangas', amount: 3500000, pending: 1500000, scholarCount: 320 },
      { name: 'Rizal Technological Univ', province: 'Rizal', amount: 1500000, pending: 50000, scholarCount: 90 },
      { name: 'University of Rizal System', province: 'Rizal', amount: 350000, pending: 0, scholarCount: 20 },
      { name: 'Southern Luzon State U', province: 'Quezon', amount: 900000, pending: 450000, scholarCount: 85 },
    ],

    services: [
      // ROW 1
      { id: 'grade-submissions', name: 'Grade Submission', topCategory: 'Regular Semester', stats: { newPending: 45, resubmitPending: 12, waitingOnScholar: 10, approved: 150 } },
      { id: 'practical-training', name: 'Practical Training', topCategory: 'OJT/Practicum', stats: { newPending: 10, resubmitPending: 3, waitingOnScholar: 5, approved: 40 } },
      { id: 'thesis-allowance', name: 'Thesis Allowance', topCategory: 'Full Release', stats: { newPending: 12, resubmitPending: 5, waitingOnScholar: 8, approved: 45 } },
      { id: 'travel-clearance', name: 'Travel Clearance', topCategory: 'Personal Travel', stats: { newPending: 5, resubmitPending: 1, waitingOnScholar: 2, approved: 30 } },
      
      // ROW 2
      { id: 'request-forms', name: 'Request Forms', topCategory: 'Certificate of Grades', stats: { newPending: 8, resubmitPending: 2, waitingOnScholar: 5, approved: 100 } },
      { id: 'shifting-transferring', name: 'Shifting/Transferring', topCategory: 'Shifting Course', stats: { newPending: 3, resubmitPending: 0, waitingOnScholar: 1, approved: 10 } },
      { id: 'leave-of-absence', name: 'Leave of Absence', topCategory: 'Medical Reason', stats: { newPending: 1, resubmitPending: 0, waitingOnScholar: 0, approved: 5 } },
      { id: 'reimbursement', name: 'Reimbursements', topCategory: 'Tuition Fee', stats: { newPending: 15, resubmitPending: 4, waitingOnScholar: 12, approved: 80 } },
      
      // ROW 3
      { id: 'support-feedback', name: 'Scholar Feedback', topCategory: 'General Inquiry', stats: { newPending: 6, resubmitPending: 1, waitingOnScholar: 0, approved: 25 } },
    ]
  };
};

export default function AdminDashboardPage() {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedSem, setSelectedSem] = useState('1st');
  const [selectedMonth, setSelectedMonth] = useState('oct');
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = getDashboardData(selectedYear, selectedSem);

  if (!isMounted) {
    return <div className="p-6 space-y-8 bg-slate-50 min-h-screen"></div>;
  }

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dost-title tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Region IV-A System Status | <span className="font-semibold text-blue-600">{selectedYear}, {selectedSem} Sem</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border text-xs font-semibold uppercase text-slate-500 shadow-sm">
             <Filter className="h-3 w-3" /> Filters
           </div>
           <Select value={selectedYear} onValueChange={setSelectedYear}>
             <SelectTrigger className="w-[140px] bg-white"><SelectValue/></SelectTrigger>
             <SelectContent>
               <SelectItem value="2024-2025">AY 2024-2025</SelectItem>
               <SelectItem value="2023-2024">AY 2023-2024</SelectItem>
             </SelectContent>
           </Select>
           <Select value={selectedSem} onValueChange={setSelectedSem}>
             <SelectTrigger className="w-[120px] bg-white"><SelectValue/></SelectTrigger>
             <SelectContent>
               <SelectItem value="1st">1st Sem</SelectItem>
               <SelectItem value="2nd">2nd Sem</SelectItem>
             </SelectContent>
           </Select>
           <Select value={selectedMonth} onValueChange={setSelectedMonth}>
             <SelectTrigger className="w-[120px] bg-white"><SelectValue/></SelectTrigger>
             <SelectContent>
               <SelectItem value="oct">October</SelectItem>
               <SelectItem value="nov">November</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </div>

      <DashboardStats 
        data={data.kpi} 
        provinceData={data.provinceStats}
        universityData={data.universityStats}
        services={data.services}
      />

      {/* SERVICE REQUESTS GRID */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          Service Requests 
          <span className="text-sm font-normal text-slate-500 bg-white px-2 py-0.5 rounded-full border">
            {data.services.reduce((acc, curr) => acc + curr.stats.newPending + curr.stats.resubmitPending, 0)} Total Pending
          </span>
        </h2>
        <ServiceGrid services={data.services} />
      </div>
    </div>
  );
}