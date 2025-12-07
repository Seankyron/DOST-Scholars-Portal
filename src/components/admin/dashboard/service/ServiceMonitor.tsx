'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, ChevronDown, ChevronRight, ExternalLink, AlertTriangle } from 'lucide-react';

interface ServiceMonitorProps {
  services: any[];
}

export function ServiceMonitor({ services }: ServiceMonitorProps) {
  const router = useRouter();
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const toggleService = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <Card className="h-full border-l-4 border-l-blue-600 shadow-md">
      <CardHeader className="bg-slate-50/50 pb-4">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Service Monitor
        </CardTitle>
        <CardDescription>Real-time queue status.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {services.map((svc) => {
            const isExpanded = expandedService === svc.id;
            const totalActionable = svc.stats.newPending + svc.stats.resubmitPending;

            return (
              <div key={svc.id} className="transition-all bg-white hover:bg-slate-50">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleService(svc.id)}
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-800">{svc.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {totalActionable > 0 ? (
                        <span className="text-orange-600 font-medium flex items-center gap-1">
                          {totalActionable} Needs Action
                        </span>
                      ) : (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3"/> All Caught Up
                        </span>
                      )}
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400"/> : <ChevronRight className="h-4 w-4 text-slate-400"/>}
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 bg-slate-50/50 animate-in slide-in-from-top-1">
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <StatusBox 
                        label="Resubmit-Pending" 
                        value={svc.stats.resubmitPending} 
                        color="text-orange-700" bg="bg-orange-100" border="border-orange-200"
                        urgent
                      />
                      <StatusBox 
                        label="New Requests" 
                        value={svc.stats.newPending} 
                        color="text-blue-700" bg="bg-blue-100" border="border-blue-200"
                      />
                      <StatusBox 
                        label="Waiting on Scholar" 
                        value={svc.stats.waitingOnScholar} 
                        color="text-slate-600" bg="bg-slate-200" border="border-slate-300"
                      />
                      <StatusBox 
                        label="Approved (Sem)" 
                        value={svc.stats.approved} 
                        color="text-emerald-700" bg="bg-emerald-100" border="border-emerald-200"
                      />
                    </div>
                    
                    <Button 
                      className="w-full mt-3 text-xs h-8" 
                      variant="outline"
                      onClick={() => router.push(`/admin/${svc.id}`)}
                    >
                      Manage Requests <ExternalLink className="ml-2 w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBox({ label, value, color, bg, border, urgent }: any) {
  return (
    <div className={`flex flex-col items-center justify-center p-2 rounded-md border ${bg} ${border}`}>
      <div className={`text-lg font-bold ${color} flex items-center gap-1`}>
        {value}
        {urgent && value > 0 && <AlertTriangle className="w-3 h-3 animate-pulse" />}
      </div>
      <div className="text-[10px] uppercase font-bold text-slate-500 text-center leading-tight">{label}</div>
    </div>
  );
}