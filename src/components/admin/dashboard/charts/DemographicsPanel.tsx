'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScholarshipType, ScholarStatus } from '@/types/dashboard';

interface DemographicsProps {
  provinceData: any[];
}

// CONFIG 1: Scholarship Types
const TYPE_CONFIG: Record<ScholarshipType, { color: string; label: string }> = {
  'RA 7687': { color: 'bg-blue-600', label: 'RA 7687' },
  'Merit': { color: 'bg-indigo-500', label: 'Merit' },
  'JLSS, RA 7687': { color: 'bg-sky-400', label: 'JLSS - 7687' },
  'JLSS, Merit': { color: 'bg-purple-500', label: 'JLSS - Merit' },
  'JLSS, RA 10612': { color: 'bg-rose-500', label: 'JLSS - 10612' },
};

// CONFIG 2: Scholar Statuses
const STATUS_CONFIG: Record<ScholarStatus, { color: string; label: string }> = {
  'Active': { color: 'bg-emerald-500', label: 'Active' },
  'Warning': { color: 'bg-amber-400', label: 'Warning' },
  '2nd Warning': { color: 'bg-orange-500', label: '2nd Warning' },
  'Suspended': { color: 'bg-red-500', label: 'Suspended' },
  'On hold': { color: 'bg-slate-400', label: 'On Hold' },
  'Graduated': { color: 'bg-blue-800', label: 'Graduated' },
  'Terminated': { color: 'bg-slate-800', label: 'Terminated' },
};

export function DemographicsPanel({ provinceData }: DemographicsProps) {
  return (
    <Card className="shadow-none border-none">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Regional Demographics</CardTitle>
            <CardDescription>
              Scholar distribution overview.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="status" className="w-full">
          {/* IMPROVED TAB DESIGN: Segmented Control Style */}
          <div className="flex justify-start mb-6">
            <TabsList className="bg-slate-100/80 p-1 rounded-lg border border-slate-200/50 inline-flex h-auto">
              <TabsTrigger 
                value="status" 
                className="rounded-md px-4 py-1.5 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
              >
                By Status
              </TabsTrigger>
              <TabsTrigger 
                value="type" 
                className="rounded-md px-4 py-1.5 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
              >
                By Scholarship Type
              </TabsTrigger>
            </TabsList>
          </div>

          {/* === TAB 1: BY STATUS === */}
          <TabsContent value="status" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300 fade-in-50">
            {/* Polished Legend */}
            <div className="flex flex-wrap gap-2 mb-6 p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <span key={key} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-100 shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${config.color}`} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{config.label}</span>
                </span>
              ))}
            </div>

            <div className="space-y-4">
              {provinceData.map((p) => (
                <div key={p.province} className="space-y-2">
                  <div className="flex justify-between items-end text-sm">
                    <span className="font-bold text-slate-700">{p.province}</span>
                    <span className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded-full">{p.total} Total</span>
                  </div>
                  
                  {/* Stacked Bar */}
                  <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-slate-100 shadow-inner">
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                      const count = p.status[key] || 0;
                      if (count === 0) return null;
                      const width = (count / p.total) * 100;
                      
                      return (
                        <div 
                          key={key} 
                          className={`h-full ${config.color} hover:brightness-110 transition-all relative group first:rounded-l-full last:rounded-r-full border-r border-white/20 last:border-0`} 
                          style={{ width: `${width}%` }}
                        >
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10 pointer-events-none">
                              <div className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${config.color} bg-white`} />
                                {config.label}: <span className="font-bold">{count}</span>
                              </div>
                              <div className="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* === TAB 2: BY TYPE === */}
          <TabsContent value="type" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300 fade-in-50">
            {/* Polished Legend */}
            <div className="flex flex-wrap gap-2 mb-6 p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                <span key={key} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-100 shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${config.color}`} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{config.label}</span>
                </span>
              ))}
            </div>

            <div className="space-y-4">
              {provinceData.map((p) => (
                <div key={p.province} className="space-y-2">
                  <div className="flex justify-between items-end text-sm">
                    <span className="font-bold text-slate-700">{p.province}</span>
                    <span className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-0.5 rounded-full">{p.total} Total</span>
                  </div>
                  
                  {/* Stacked Bar */}
                  <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-slate-100 shadow-inner">
                    {Object.entries(TYPE_CONFIG).map(([key, config]) => {
                      const count = p.type[key] || 0;
                      if (count === 0) return null;
                      const width = (count / p.total) * 100;
                      
                      return (
                        <div 
                          key={key} 
                          className={`h-full ${config.color} hover:brightness-110 transition-all relative group first:rounded-l-full last:rounded-r-full border-r border-white/20 last:border-0`} 
                          style={{ width: `${width}%` }}
                        >
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10 pointer-events-none">
                              <div className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${config.color} bg-white`} />
                                {config.label}: <span className="font-bold">{count}</span>
                              </div>
                              <div className="w-2 h-2 bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}