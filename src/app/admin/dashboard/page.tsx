'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Filter, Loader2, RefreshCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';

import { DashboardStats } from '@/components/admin/dashboard/stats/DashboardStats';
import { ServiceGrid } from '@/components/admin/dashboard/service/ServiceGrid';
import { DashboardData } from '@/types/dashboard';

// Default empty state
const defaultData: DashboardData = {
  kpi: {
    totalScholars: 0,
    stipendReleased: 0,
    urgentPending: 0,
  },
  provinceStats: [],
  services: [],
  // @ts-ignore
  universityStats: []
};

const MONTHS = [
  { value: 'jan', label: 'January' },
  { value: 'feb', label: 'February' },
  { value: 'mar', label: 'March' },
  { value: 'apr', label: 'April' },
  { value: 'may', label: 'May' },
  { value: 'jun', label: 'June' },
  { value: 'jul', label: 'July' },
  { value: 'aug', label: 'August' },
  { value: 'sep', label: 'September' },
  { value: 'oct', label: 'October' },
  { value: 'nov', label: 'November' },
  { value: 'dec', label: 'December' },
];

export default function AdminDashboardPage() {
  // Filters
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSem, setSelectedSem] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  
  // Data State
  const [data, setData] = useState<DashboardData>(defaultData);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
    fetchAvailableYears();
  }, []);

  // --- 1. Fetch Dynamic Academic Years from Data ---
  const fetchAvailableYears = async () => {
    try {
      // We use GradeSubmissionView as a source of truth for existing Academic Years
      const { data } = await supabase
        .from('GradeSubmissionView')
        .select('academic_year')
        .not('academic_year', 'is', null);

      if (data) {
        // Extract unique years and sort them
        const uniqueYears = Array.from(new Set(data.map(item => item.academic_year)))
          .filter(Boolean)
          .sort()
          .reverse(); // Newest first
        
        setAvailableYears(uniqueYears as string[]);
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // --- 2. Pass all filters to the RPC ---
      const { data: analytics, error } = await supabase.rpc('get_admin_dashboard_analytics', {
        filter_year: selectedYear === 'All' ? null : selectedYear,
        filter_sem: selectedSem === 'All' ? null : selectedSem,
        filter_month: selectedMonth === 'All' ? null : selectedMonth
      } as any);

      if (error) throw error;

      if (analytics) {
        setData(analytics as unknown as DashboardData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Could not load dashboard analytics.');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when any filter changes
  useEffect(() => {
    if (isMounted) {
      fetchDashboardData();
    }
  }, [selectedYear, selectedSem, selectedMonth, isMounted]);

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
            Region IV-A System Status | 
            <span className="font-semibold text-blue-600 ml-1">
              {selectedYear === 'All' && selectedSem === 'All' && selectedMonth === 'All'
                ? 'All Records' 
                : 'Filtered View'}
            </span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <Button 
             variant="outline" 
             size="sm" 
             className="bg-white text-slate-500 border-slate-200"
             onClick={fetchDashboardData}
             disabled={loading}
           >
             <RefreshCcw className={`h-3 w-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
             Refresh
           </Button>
           
           <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border text-xs font-semibold uppercase text-slate-500 shadow-sm">
             <Filter className="h-3 w-3" /> Filters
           </div>
           
           {/* Dynamic Year Filter */}
           <Select value={selectedYear} onValueChange={setSelectedYear}>
             <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Year" /></SelectTrigger>
             <SelectContent>
               <SelectItem value="All">All Years</SelectItem>
               {availableYears.map((year) => (
                 <SelectItem key={year} value={year}>{year}</SelectItem>
               ))}
               {availableYears.length === 0 && (
                 <>
                   {/* Fallback if no data found yet */}
                   <SelectItem value="2024-2025">AY 2024-2025</SelectItem>
                   <SelectItem value="2023-2024">AY 2023-2024</SelectItem>
                 </>
               )}
             </SelectContent>
           </Select>
           
           {/* Semester Filter */}
           <Select value={selectedSem} onValueChange={setSelectedSem}>
             <SelectTrigger className="w-[130px] bg-white"><SelectValue placeholder="Semester" /></SelectTrigger>
             <SelectContent>
               <SelectItem value="All">All Semesters</SelectItem>
               <SelectItem value="1st Semester">1st Semester</SelectItem>
               <SelectItem value="2nd Semester">2nd Semester</SelectItem>
               <SelectItem value="Midyear">Midyear</SelectItem>
             </SelectContent>
           </Select>
           
           {/* Expanded Month Filter */}
           <Select value={selectedMonth} onValueChange={setSelectedMonth}>
             <SelectTrigger className="w-[130px] bg-white"><SelectValue placeholder="Month" /></SelectTrigger>
             <SelectContent>
               <SelectItem value="All">All Months</SelectItem>
               {MONTHS.map((m) => (
                 <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
               ))}
             </SelectContent>
           </Select>
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 gap-4">
           <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
           <p className="text-sm font-medium">Aggregating analytics...</p>
        </div>
      ) : (
        <>
          <DashboardStats 
            data={data.kpi} 
            provinceData={data.provinceStats}
            // @ts-ignore
            universityData={data.universityStats || []}
            services={data.services}
          />

          {/* SERVICE REQUESTS GRID */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              Service Requests 
              <span className="text-sm font-normal text-slate-500 bg-white px-2 py-0.5 rounded-full border">
                {data.services.reduce((acc, curr) => acc + (curr.stats?.newPending || 0) + (curr.stats?.resubmitPending || 0), 0)} Total Pending
              </span>
            </h2>
            <ServiceGrid services={data.services} />
          </div>
        </>
      )}
    </div>
  );
}