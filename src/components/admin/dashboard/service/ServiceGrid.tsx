'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ServiceGridProps {
  services: any[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  const router = useRouter();

  // FIX: Added a secondary sort by Name/ID to ensure consistent order (Stable Sort)
  const sortedServices = [...services].sort((a, b) => {
    const urgencyDiff = b.stats.resubmitPending - a.stats.resubmitPending;
    
    // If urgency is different, prioritize urgent ones
    if (urgencyDiff !== 0) return urgencyDiff;
    
    // If urgency is the same, sort alphabetically by name (Tie-Breaker)
    // This prevents the "Hydration Failed" error
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sortedServices.map((svc) => {
        const totalPending = svc.stats.newPending + svc.stats.resubmitPending;
        const hasUrgent = svc.stats.resubmitPending > 0;

        return (
          <Card 
            key={svc.id} 
            className={`hover:shadow-lg transition-all duration-200 border-t-4 ${
              hasUrgent 
                ? 'border-t-orange-500 bg-orange-50/10 border-orange-200 shadow-sm' 
                : 'border-t-transparent hover:border-t-blue-500' 
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg ${hasUrgent ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                  {hasUrgent ? <AlertTriangle className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                
                {hasUrgent ? (
                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700 animate-pulse">
                    {svc.stats.resubmitPending} Urgent
                  </span>
                ) : totalPending > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {totalPending} New
                  </span>
                ) : (
                   <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                )}
              </div>
              <CardTitle className="mt-3 text-base font-bold text-slate-800">
                {svc.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-1">Top Category:</p>
                <p className="text-sm font-medium text-slate-700 truncate" title={svc.topCategory}>
                  {svc.topCategory || "General"}
                </p>
              </div>

              <div className="flex gap-2 text-xs mb-4">
                <div className={`flex-1 p-2 rounded border ${hasUrgent ? 'bg-orange-100 border-orange-200' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                  <span className={`block font-bold text-lg ${hasUrgent ? 'text-orange-700' : 'text-slate-400'}`}>
                    {svc.stats.resubmitPending}
                  </span>
                  <span className={hasUrgent ? 'text-orange-800 font-semibold' : 'text-slate-500'}>Resubmits</span>
                </div>

                <div className="flex-1 bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="block font-bold text-lg text-blue-600">{svc.stats.newPending}</span>
                  <span className="text-slate-500">New</span>
                </div>
              </div>

              <Button 
                variant={hasUrgent ? "secondary" : "primary"}
                className={`w-full justify-between text-xs group ${hasUrgent ? 'bg-orange-600 hover:bg-orange-700 border-orange-600 text-white' : ''}`}
                onClick={() => router.push(`/admin/${svc.id}`)}
              >
                {hasUrgent ? "Review Urgent" : "Manage Requests"}
                <ArrowRight className={`h-3 w-3 ${hasUrgent ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} group-hover:translate-x-1 transition-transform`} />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}