import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Wallet, AlertTriangle } from 'lucide-react';

interface StatsProps {
  data: {
    totalScholars: number;
    stipendReleased: number;
    urgentPending: number;
  };
}

export function DashboardStats({ data }: StatsProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Scholars */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Total Scholars</CardTitle>
          <div className="p-2 rounded-full bg-slate-100">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{data.totalScholars}</div>
          <p className="text-xs text-muted-foreground mt-1">Active & Enrolled</p>
        </CardContent>
      </Card>

      {/* Funds Released */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Funds Released</CardTitle>
          <div className="p-2 rounded-full bg-slate-100">
            <Wallet className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(data.stipendReleased)}</div>
          <p className="text-xs text-muted-foreground mt-1">For selected period</p>
        </CardContent>
      </Card>

      {/* Urgent Actions */}
      <Card className="border-l-4 border-l-orange-500 bg-orange-50/20 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Urgent Actions</CardTitle>
          <div className="p-2 rounded-full bg-orange-100">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">{data.urgentPending}</div>
          <p className="text-xs text-muted-foreground mt-1">Resubmissions & Verifications</p>
        </CardContent>
      </Card>
    </div>
  );
}