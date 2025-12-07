'use client';

import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { DashboardStats } from '@/components/admin/dashboard/stats/DashboardStats';
import { StipendReleased } from '@/components/admin/dashboard/finance/StipendReleased';
import { DemographicsPanel } from '@/components/admin/dashboard/charts/DemographicsPanel';
import { ServiceGrid } from '@/components/admin/dashboard/service/ServiceGrid';

// Ensure this function uses STATIC data or deterministic logic (no Math.random)
const getDashboardData = (year: string, semester: string) => {
  const isPastYear = year === '2023-2024';
  return {
    kpi: {
      totalScholars: isPastYear ? 980 : 1245,
      stipendReleased: isPastYear ? 12000000 : 15450000,
      urgentPending: isPastYear ? 0 : 18, 
    },
    provinceStats: [
      { province: 'Cavite', total: 450, stipendReleased: 5000000, status: { Active: 400, Warning: 30, Suspended: 20 }, type: { 'RA 7687': 300, 'Merit': 150 } },
      { province: 'Laguna', total: 320, stipendReleased: 4200000, status: { Active: 290, Warning: 20, Suspended: 10 }, type: { 'RA 7687': 200, 'Merit': 120 } },
      { province: 'Batangas', total: 280, stipendReleased: 3500000, status: { Active: 250, Warning: 25, Suspended: 5 }, type: { 'RA 7687': 220, 'Merit': 60 } },
      { province: 'Rizal', total: 110, stipendReleased: 1850000, status: { Active: 100, Warning: 8, Suspended: 2 }, type: { 'RA 7687': 80, 'Merit': 30 } },
      { province: 'Quezon', total: 85, stipendReleased: 900000, status: { Active: 70, Warning: 10, Suspended: 5 }, type: { 'RA 7687': 60, 'Merit': 25 } },
    ],
    universityStats: [
      { name: 'Cavite State University', province: 'Cavite', amount: 3000000, scholarCount: 200 },
      { name: 'De La Salle - Dasmariñas', province: 'Cavite', amount: 2000000, scholarCount: 150 },
      { name: 'UP Los Baños', province: 'Laguna', amount: 3200000, scholarCount: 210 },
      { name: 'Laguna State Poly U', province: 'Laguna', amount: 1000000, scholarCount: 80 },
      { name: 'Batangas State University', province: 'Batangas', amount: 3500000, scholarCount: 320 },
      { name: 'Rizal Technological Univ', province: 'Rizal', amount: 1500000, scholarCount: 90 },
      { name: 'University of Rizal System', province: 'Rizal', amount: 350000, scholarCount: 20 },
      { name: 'Southern Luzon State U', province: 'Quezon', amount: 900000, scholarCount: 85 },
    ],
    services: [
      { id: 'grade-submissions', name: 'Grade Submission', topCategory: 'Regular Semester', stats: { newPending: 45, resubmitPending: 12 } },
      { id: 'travel-clearance', name: 'Travel Clearance', topCategory: 'Personal Travel', stats: { newPending: 5, resubmitPending: 1 } },
      { id: 'thesis-allowance', name: 'Thesis Allowance', topCategory: 'Full Release', stats: { newPending: 12, resubmitPending: 5 } },
      { id: 'request-forms', name: 'Request Forms', topCategory: 'Certificate of Grades', stats: { newPending: 8, resubmitPending: 2 } },
      { id: 'shifting', name: 'Shifting/Transferring', topCategory: 'Shifting Course', stats: { newPending: 3, resubmitPending: 0 } },
      { id: 'loas', name: 'Leave of Absence', topCategory: 'Medical Reason', stats: { newPending: 1, resubmitPending: 0 } },
      { id: 'reimbursements', name: 'Reimbursements', topCategory: 'Tuition Fee', stats: { newPending: 15, resubmitPending: 4 } },
      { id: 'clearance', name: 'Final Clearance', topCategory: 'Graduation', stats: { newPending: 0, resubmitPending: 0 } },
    ]
  };
};

export default function AdminDashboardPage() {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedSem, setSelectedSem] = useState('1st');
  const [selectedMonth, setSelectedMonth] = useState('oct');
  
  // FIX: Add mounted check to prevent Hydration Errors
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch data
  const data = getDashboardData(selectedYear, selectedSem);

  // FIX: Prevent rendering dashboard until client is ready
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

      <DashboardStats data={data.kpi} />

      <div className="grid gap-6 md:grid-cols-12 h-auto">
        <div className="md:col-span-8 h-full">
           <StipendReleased 
              provinceData={data.provinceStats} 
              universityData={data.universityStats}
           />
        </div>

        <div className="md:col-span-4 h-full">
           <DemographicsPanel provinceData={data.provinceStats} />
        </div>
      </div>

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