'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, CheckCircle2, School, ChevronRight, BarChart3, List } from 'lucide-react';

interface StipendProps {
  provinceData: {
    province: string;
    stipendReleased: number;
  }[];
  universityData: {
    name: string;
    province: string;
    amount: number;
    scholarCount: number;
  }[];
}

export function StipendReleased({ provinceData, universityData }: StipendProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('list');
  
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(val);

  const formatCompactNumber = (number: number) => {
    return new Intl.NumberFormat('en-PH', { notation: "compact", compactDisplay: "short" }).format(number);
  };

  const handleProvinceClick = (province: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/admin/stipend-tracking?province=${province}&status=released`);
  };

  const maxProvince = Math.max(...provinceData.map(p => p.stipendReleased)) || 1;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Stipend Distribution Tracker</CardTitle>
            <CardDescription>Breakdown by Province & University</CardDescription>
          </div>
          
          {/* VIEW TOGGLE */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('list')}
              className={`p-1.5 rounded-md transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`p-1.5 rounded-md transition-all ${activeTab === 'chart' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Chart View"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        
        {/* === VIEW 1: ACCORDION LIST === */}
        <div className={activeTab === 'list' ? 'block' : 'hidden'}>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {provinceData.map((item) => {
              const provinceUnis = universityData.filter(u => u.province === item.province);
              const maxUni = Math.max(...provinceUnis.map(u => u.amount), 1);

              return (
                <AccordionItem key={item.province} value={item.province} className="border rounded-lg px-2 shadow-sm bg-white">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex flex-col w-full gap-2 pr-4">
                      <div className="flex justify-between text-sm w-full">
                        <span className="font-bold flex items-center gap-2 text-slate-700">
                          <MapPin className="h-4 w-4 text-blue-500" /> 
                          {item.province}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{formatCurrency(item.stipendReleased)}</span>
                      </div>
                      <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${(item.stipendReleased / maxProvince) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="pt-1 pb-4 pl-4 pr-2">
                    <div className="space-y-3 mt-2 border-l-2 border-slate-100 pl-4">
                      {provinceUnis.length > 0 ? (
                        provinceUnis.map((uni) => (
                          <div key={uni.name} className="group">
                            <div className="flex justify-between items-center mb-1">
                               <div className="flex items-center gap-2">
                                 <School className="h-3 w-3 text-slate-400" />
                                 <span className="text-xs font-medium text-slate-600 truncate max-w-[180px]" title={uni.name}>{uni.name}</span>
                               </div>
                               <span className="text-xs font-mono text-slate-600">{formatCurrency(uni.amount)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                               <div 
                                 className="h-full bg-indigo-400 rounded-full group-hover:bg-indigo-500 transition-colors" 
                                 style={{ width: `${(uni.amount / maxUni) * 100}%` }}
                               />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No specific university data listed.</p>
                      )}
                      
                      <button 
                        onClick={(e) => handleProvinceClick(item.province, e)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center mt-3"
                      >
                        View full report for {item.province} <ChevronRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* === VIEW 2: VISUAL CHART === */}
        <div className={activeTab === 'chart' ? 'h-full flex flex-col justify-end pt-4 pb-2' : 'hidden'}>
          <div className="flex items-end justify-between h-[250px] gap-2 px-2">
            {provinceData.map((item) => {
              const heightPercentage = (item.stipendReleased / maxProvince) * 100;
              return (
                <div key={item.province} className="group relative flex-1 flex flex-col justify-end items-center h-full">
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded py-1 px-2 pointer-events-none z-10 whitespace-nowrap">
                    {formatCurrency(item.stipendReleased)}
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                  </div>

                  {/* Value Label (Top of bar) */}
                  <span className="text-[10px] font-bold text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatCompactNumber(item.stipendReleased)}
                  </span>

                  {/* The Bar */}
                  <div 
                    className="w-full max-w-[40px] bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all duration-300 relative"
                    style={{ height: `${heightPercentage}%` }}
                  >
                    {/* Pattern/Texture overlay for visual flair */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50"></div>
                  </div>

                  {/* X-Axis Label */}
                  <div className="mt-2 text-center">
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block truncate max-w-[60px]" title={item.province}>
                      {item.province.substring(0, 3)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 border-t pt-4">
             <div className="flex justify-between items-center text-xs text-slate-500">
               <span>Total Released: <span className="font-bold text-slate-800">{formatCompactNumber(provinceData.reduce((a,b) => a + b.stipendReleased, 0))}</span></span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Province Share</span>
             </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}