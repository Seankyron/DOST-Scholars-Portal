import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Users, Wallet, AlertTriangle, MousePointerClick } from 'lucide-react';

import { DemographicsPanel } from '../charts/DemographicsPanel';
import { StipendReleased } from '../finance/StipendReleased';
import { ServiceMonitor } from '../service/ServiceMonitor';

interface StatsProps {
  data: {
    totalScholars: number;
    stipendReleased: number;
    urgentPending: number;
  };
  provinceData: any[];    
  universityData: any[];  
  services: any[];        
}

export function DashboardStats({ data, provinceData, universityData, services }: StatsProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      
      {/* 1. TOTAL SCHOLARS -> Demographics Popup */}
      <Dialog>
        <DialogTrigger asChild>
          <Card className="hover:shadow-md transition-all cursor-pointer group border-blue-200 hover:border-blue-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <MousePointerClick className="h-4 w-4 text-blue-500" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Scholars</CardTitle>
              <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data.totalScholars}</div>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-blue-600 transition-colors">
                Click to view Demographics
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* VISUALLY HIDDEN TITLE FOR ACCESSIBILITY */}
          <DialogTitle className="sr-only">Scholar Demographics</DialogTitle>
          <DialogDescription className="sr-only">Detailed breakdown of scholar demographics by province and status.</DialogDescription>
          
          <DemographicsPanel provinceData={provinceData} />
        </DialogContent>
      </Dialog>

      {/* 2. FUNDS RELEASED -> Stipend Tracker Popup */}
      <Dialog>
        <DialogTrigger asChild>
          <Card className="hover:shadow-md transition-all cursor-pointer group border-emerald-200 hover:border-emerald-400 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <MousePointerClick className="h-4 w-4 text-emerald-500" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Funds Released</CardTitle>
              <div className="p-2 rounded-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.stipendReleased)}</div>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-emerald-600 transition-colors">
                Click to view Distribution
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-10 overflow-hidden gap-0 scrollbar-thin">
          {/* VISUALLY HIDDEN TITLE FOR ACCESSIBILITY */}
          <DialogTitle className="sr-only">Stipend Disbursement Tracker</DialogTitle>
          <DialogDescription className="sr-only">Track released vs pending funds for scholars.</DialogDescription>

          <StipendReleased 
             provinceData={provinceData} 
             universityData={universityData}
             className="h-full" 
          />
        </DialogContent>
      </Dialog>

      {/* 3. URGENT ACTIONS -> Service Monitor Popup */}
      <Dialog>
        <DialogTrigger asChild>
          <Card className="border-l-4 border-l-orange-500 bg-orange-50/20 hover:shadow-md transition-all cursor-pointer group hover:bg-orange-50/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <MousePointerClick className="h-4 w-4 text-orange-500" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Urgent Actions</CardTitle>
              <div className="p-2 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{data.urgentPending}</div>
              <p className="text-xs text-muted-foreground mt-1 group-hover:text-orange-700 transition-colors">
                Click to view Queue Status
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-5 scrollbar-thin  ">
           {/* VISUALLY HIDDEN TITLE FOR ACCESSIBILITY */}
           <DialogTitle className="sr-only">Urgent Actions Queue</DialogTitle>
           <DialogDescription className="sr-only">List of urgent service requests requiring admin attention.</DialogDescription>

           <ServiceMonitor 
              services={services} 
              className="border-none shadow-none border-l-0 h-full"
              filterMode="actionable" 
           />
        </DialogContent>
      </Dialog>

    </div>
  );
}