'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Filter, Loader2, RefreshCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { DashboardStats } from '@/components/admin/dashboard/stats/DashboardStats';
import { ServiceGrid } from '@/components/admin/dashboard/service/ServiceGrid';
import { DashboardData, ProvinceStats, UniversityStats, ServiceStats, ScholarStatus, ScholarshipType } from '@/types/dashboard';

const ALLOWED_SERVICES = [
  'Grade Submission',
  'Travel Clearance',
  'Practical Training', 'PTP Submission', 
  'Reimbursement',
  'Thesis Allowance',
  'Leave of Absence',
  'Shifting/Transferring', 'Shifting Course',
  'Request Forms'
];

const defaultData: DashboardData = {
  kpi: { totalScholars: 0, stipendReleased: 0, urgentPending: 0 },
  provinceStats: [],
  services: [],
  universityStats: []
};

// --- HELPER: Date Filtering Logic ---
const isDateInFilter = (dateString: string | null, year: string, sem: string, month: string) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const monthIdx = date.getMonth(); // 0-11
  const dYear = date.getFullYear();

  // 1. Check Month Filter (simple check)
  if (month !== 'All') {
    const monthMap: Record<string, number> = { 
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 
      'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 
    };
    if (monthMap[month.toLowerCase()] !== undefined && monthIdx !== monthMap[month.toLowerCase()]) {
      return false;
    }
  }

  // 2. Check Year & Sem (Academic Year Logic)
  // Approximate PH Academic Calendar:
  // 1st Sem: Aug - Dec
  // 2nd Sem: Jan - May
  // Midyear: Jun - Jul
  if (year !== 'All') {
    const [startYearStr, endYearStr] = year.split('-');
    const startYear = parseInt(startYearStr);
    const endYear = parseInt(endYearStr);
    
    // Valid date range for the Academic Year (Aug startYear to Jul endYear)
    const ayStart = new Date(startYear, 7, 1); // Aug 1
    const ayEnd = new Date(endYear, 6, 31);   // July 31
    
    if (date < ayStart || date > ayEnd) return false;
  }

  if (sem !== 'All') {
    // 1st Sem: Aug (7) - Dec (11)
    // 2nd Sem: Jan (0) - May (4)
    // Midyear: Jun (5) - Jul (6)
    if (sem === '1st' && (monthIdx < 7 && monthIdx > 11)) return false; // Not in Aug-Dec (Note: simplistic, assumes correct AY year)
    
    // More robust check: Check month index strictly
    const isFirst = monthIdx >= 7 && monthIdx <= 11;
    const isSecond = monthIdx >= 0 && monthIdx <= 4;
    const isMid = monthIdx >= 5 && monthIdx <= 6;

    if (sem === '1st' && !isFirst) return false;
    if (sem === '2nd' && !isSecond) return false;
    if (sem === 'Midyear' && !isMid) return false;
  }

  return true;
};


export default function AdminDashboardPage() {
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedSem, setSelectedSem] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  
  const [data, setData] = useState<DashboardData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchDashboardData = async () => {
    if (loading) setLoading(true);

    try {
      const [scholarsReq, stipendsReq, transactionsReq] = await Promise.all([
        supabase.from('admin_scholar_view').select('*'),
        supabase.from('stipend_tracking_view').select('*'),
        supabase.from('all_transactions_view').select('*')
      ]);

      if (scholarsReq.error) throw scholarsReq.error;
      if (stipendsReq.error) throw stipendsReq.error;
      if (transactionsReq.error) throw transactionsReq.error;

      const scholars = scholarsReq.data || [];
      const stipends = stipendsReq.data || [];
      const rawTransactions = transactionsReq.data || [];

      // --- FILTER 1: Transactions (Services) ---
      // We filter by Activity type AND Date (Year/Sem/Month)
      const transactions = rawTransactions.filter(t => {
        const isAllowedService = t.activity && ALLOWED_SERVICES.includes(t.activity);
        if (!isAllowedService) return false;

        // Apply Time Filters using created_at
        return isDateInFilter(t.created_at, selectedYear, selectedSem, selectedMonth);
      });

      // --- FILTER 2: Stipends (Financials) ---
      // We filter by columns provided in the view
      const filteredStipends = stipends.filter(s => {
        // Year Check
        if (selectedYear !== 'All' && s.academic_year !== selectedYear) return false;
        
        // Sem Check
        if (selectedSem !== 'All' && s.semester !== selectedSem) return false;

        // Month Check (using updated_at or created_at as proxy for release date)
        if (selectedMonth !== 'All') {
          return isDateInFilter(s.updated_at, 'All', 'All', selectedMonth);
        }

        return true;
      });

      // --- AGGREGATION LOGIC ---

      // 1. KPI Calculations
      const totalScholars = scholars.length; // We keep total scholars constant as population
      const stipendReleased = filteredStipends.reduce((sum, s) => sum + (s.received || 0), 0);
      const urgentPending = transactions.filter(t => t.status === 'Pending').length;

      // 2. Map Scholar Details for Joining
      const scholarMap = new Map<string, { province: string; university: string }>();
      scholars.forEach(s => {
        if (s.spas_id) {
          scholarMap.set(s.spas_id, {
            province: s.province || 'Unknown',
            university: s.university || 'Unknown',
          });
        }
      });

      // 3. Province Stats
      const provinceMap = new Map<string, ProvinceStats>();

      // Initialize with Scholar Demographics (Total population)
      scholars.forEach(s => {
        const prov = s.province || 'Unknown';
        if (!provinceMap.has(prov)) {
          provinceMap.set(prov, {
            province: prov,
            total: 0,
            stipendReleased: 0,
            pendingAmount: 0,
            status: { 'Active': 0, 'Warning': 0, '2nd Warning': 0, 'Suspended': 0, 'Graduated': 0, 'Terminated': 0, 'On hold': 0 },
            type: { 'RA 7687': 0, 'Merit': 0, 'JLSS, RA 7687': 0, 'JLSS, Merit': 0, 'JLSS, RA 10612': 0 }
          });
        }
        
        const entry = provinceMap.get(prov)!;
        entry.total++;
        
        const statusKey = s.scholarship_status as ScholarStatus;
        if (statusKey && entry.status[statusKey] !== undefined) entry.status[statusKey]++;

        const typeKey = s.scholarship_type as ScholarshipType;
        if (typeKey && entry.type[typeKey] !== undefined) entry.type[typeKey]++;
      });

      // Add Financials from FILTERED stipends
      filteredStipends.forEach(s => {
        if (s.spas_id && scholarMap.has(s.spas_id)) {
          const prov = scholarMap.get(s.spas_id)!.province;
          if (provinceMap.has(prov)) {
             const entry = provinceMap.get(prov)!;
             entry.stipendReleased += (s.received || 0);
             entry.pendingAmount += (s.unreleased || 0);
          }
        }
      });

      // 4. University Stats
      const uniMap = new Map<string, UniversityStats>();
      
      scholars.forEach(s => {
        const uni = s.university || 'Unknown';
        if (!uniMap.has(uni)) {
          uniMap.set(uni, {
            name: uni,
            province: s.province || 'Unknown',
            amount: 0,
            pending: 0,
            scholarCount: 0
          });
        }
        uniMap.get(uni)!.scholarCount++;
      });

      // Add Financials from FILTERED stipends
      filteredStipends.forEach(s => {
        if (s.spas_id && scholarMap.has(s.spas_id)) {
          const uni = scholarMap.get(s.spas_id)!.university;
          if (uniMap.has(uni)) {
             const entry = uniMap.get(uni)!;
             entry.amount += (s.received || 0);
             entry.pending += (s.unreleased || 0);
          }
        }
      });

      // 5. Service Stats (using filtered transactions)
      const serviceMap = new Map<string, ServiceStats>();
      
      transactions.forEach(t => {
        const activityName = t.activity || 'Other';
        
        if (!serviceMap.has(activityName)) {
          serviceMap.set(activityName, {
            id: activityName,
            name: activityName,
            topCategory: activityName,
            stats: { newPending: 0, resubmitPending: 0, waitingOnScholar: 0, approved: 0 }
          });
        }
        
        const stats = serviceMap.get(activityName)!.stats;
        if (t.status === 'Pending') stats.newPending++;
        else if (t.status === 'Approved') stats.approved++;
        else if (t.status === 'Resubmit-Pending') stats.resubmitPending++;
      });

      setData({
        kpi: { totalScholars, stipendReleased, urgentPending },
        provinceStats: Array.from(provinceMap.values()),
        universityStats: Array.from(uniMap.values()),
        services: Array.from(serviceMap.values())
      });

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error("Fetch Error", {
        description: "Could not load dashboard data from views."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    fetchDashboardData();

    const channel = supabase
      .channel('admin-dashboard-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'User' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Stipend Tracking' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Grade Submission' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Travel Clearance' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'PTP Submission' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Reimbursement' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Thesis Allowance' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Leave of Absence' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Shifting Course' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Request Forms' }, () => fetchDashboardData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedYear, selectedSem, selectedMonth, isMounted]); // Added selectedMonth to dependencies

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
                ? 'All Records (Live View)' 
                : `${selectedYear === 'All' ? 'All Years' : selectedYear}, ${selectedSem === 'All' ? 'All Semesters' : selectedSem + ' Sem'} ${selectedMonth !== 'All' ? '(' + selectedMonth.toUpperCase() + ')' : ''}`
              }
            </span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <Button 
             variant="outline" 
             size="sm" 
             className="bg-white text-slate-500 border-slate-200"
             onClick={() => { setLoading(true); fetchDashboardData(); }}
             disabled={loading}
           >
             <RefreshCcw className={`h-3 w-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
             Refresh
           </Button>
           
           <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border text-xs font-semibold uppercase text-slate-500 shadow-sm">
             <Filter className="h-3 w-3" /> Filters
           </div>
           
           <Select value={selectedYear} onValueChange={setSelectedYear}>
             <SelectTrigger className="w-[140px] bg-white"><SelectValue/></SelectTrigger>
             <SelectContent>
               <SelectItem value="All">All Years</SelectItem>
               <SelectItem value="2024-2025">AY 2024-2025</SelectItem>
               <SelectItem value="2023-2024">AY 2023-2024</SelectItem>
             </SelectContent>
           </Select>
           
           <Select value={selectedSem} onValueChange={setSelectedSem}>
             <SelectTrigger className="w-[120px] bg-white"><SelectValue/></SelectTrigger>
             <SelectContent>
               <SelectItem value="All">All Semesters</SelectItem>
               <SelectItem value="1st">1st Sem</SelectItem>
               <SelectItem value="2nd">2nd Sem</SelectItem>
               <SelectItem value="Midyear">Midyear</SelectItem>
             </SelectContent>
           </Select>
           
           <Select value={selectedMonth} onValueChange={setSelectedMonth}>
             <SelectTrigger className="w-[120px] bg-white"><SelectValue/></SelectTrigger>
             <SelectContent>
               <SelectItem value="All">All Months</SelectItem>
               <SelectItem value="jan">January</SelectItem>
               <SelectItem value="feb">February</SelectItem>
               <SelectItem value="mar">March</SelectItem>
               <SelectItem value="apr">April</SelectItem>
               <SelectItem value="may">May</SelectItem>
               <SelectItem value="jun">June</SelectItem>
               <SelectItem value="jul">July</SelectItem>
               <SelectItem value="aug">August</SelectItem>
               <SelectItem value="sep">September</SelectItem>
               <SelectItem value="oct">October</SelectItem>
               <SelectItem value="nov">November</SelectItem>
               <SelectItem value="dec">December</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 gap-4">
           <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
           <p className="text-sm font-medium">Aggregating live data...</p>
        </div>
      ) : (
        <>
          <DashboardStats 
            data={data.kpi} 
            provinceData={data.provinceStats}
            universityData={data.universityStats}
            services={data.services}
          />

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