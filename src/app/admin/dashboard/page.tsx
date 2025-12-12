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

// Default empty state matching the interface
const defaultData: DashboardData = {
  kpi: {
    totalScholars: 0,
    stipendReleased: 0,
    urgentPending: 0,
  },
  provinceStats: [],
  services: [],
  // @ts-ignore - universityStats might be missing from the strict type but is used in the component
  universityStats: []
};

export default function AdminDashboardPage() {
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedSem, setSelectedSem] = useState('1st');
  const [selectedMonth, setSelectedMonth] = useState('oct');
  
  const [data, setData] = useState<DashboardData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Call the Postgres function we created
      const { data: analytics, error } = await supabase.rpc('get_admin_dashboard_analytics', {
        filter_year: selectedYear,
        filter_sem: selectedSem
      });

      if (error) throw error;

      if (analytics) {
        // Force cast the JSON response to our DashboardData type
        setData(analytics as unknown as DashboardData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Could not load dashboard analytics.')
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    if (isMounted) {
      fetchDashboardData();
    }
  }, [selectedYear, selectedSem, isMounted]);

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
               <SelectItem value="Midyear">Midyear</SelectItem>
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