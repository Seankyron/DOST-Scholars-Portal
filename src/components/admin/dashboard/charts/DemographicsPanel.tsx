'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DemographicsProps {
  provinceData: any[];
}

export function DemographicsPanel({ provinceData }: DemographicsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Demographics</CardTitle>
        <CardDescription>
          Breakdown of scholar distribution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="mb-4 w-full justify-start bg-slate-100">
            <TabsTrigger value="status" className="flex-1 md:flex-none">By Status</TabsTrigger>
            <TabsTrigger value="type" className="flex-1 md:flex-none">By Type</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6 animate-in fade-in-50">
            {provinceData.map((p) => (
              <div key={p.province} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{p.province}</span>
                  <span className="text-slate-500 text-xs">{p.total} Scholars</span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(p.status.Active / p.total) * 100}%` }} />
                  <div className="bg-amber-400 h-full" style={{ width: `${(p.status.Warning / p.total) * 100}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${(p.status.Suspended / p.total) * 100}%` }} />
                </div>
                <div className="flex justify-start gap-3 text-[10px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>Active ({p.status.Active})</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"/>Warning ({p.status.Warning})</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"/>Suspended ({p.status.Suspended})</span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="type" className="space-y-6 animate-in fade-in-50">
            {provinceData.map((p) => (
              <div key={p.province} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{p.province}</span>
                  <span className="text-slate-500 text-xs">{p.total} Scholars</span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${(p.type['RA 7687'] / p.total) * 100}%` }} />
                  <div className="bg-indigo-400 h-full" style={{ width: `${(p.type['Merit'] / p.total) * 100}%` }} />
                </div>
                <div className="flex justify-start gap-3 text-[10px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-600"/>RA 7687 ({p.type['RA 7687']})</span>
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"/>Merit ({p.type['Merit']})</span>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}