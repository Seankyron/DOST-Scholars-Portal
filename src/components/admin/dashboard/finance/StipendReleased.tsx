'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StipendProps {
  provinceData: {
    province: string;
    stipendReleased: number;
    pendingAmount: number;
  }[];
  universityData?: any[]; 
  className?: string;
}

export function StipendReleased({ provinceData, className }: StipendProps) {
  const router = useRouter();
  
  const formatCompactNumber = (number: number) => {
    return new Intl.NumberFormat('en-PH', { notation: "compact", compactDisplay: "short" }).format(number);
  };

  const handleProvinceClick = (province: string) => {
    router.push(`/admin/stipend-tracking?province=${province}`);
  };

  const totalReleased = provinceData.reduce((acc, curr) => acc + curr.stipendReleased, 0);
  const totalPending = provinceData.reduce((acc, curr) => acc + curr.pendingAmount, 0);
  const totalBudget = totalReleased + totalPending;
  const overallProgress = totalBudget > 0 ? (totalReleased / totalBudget) * 100 : 0;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* HEADER SECTION */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Stipend Disbursement</h2>
            <p className="text-sm text-slate-500">Track released vs. pending funds</p>
          </div>
          <div className="text-right">
             <div className="text-3xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
             <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completion</div>
          </div>
        </div>

        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
           <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
        </div>
        
        <div className="flex justify-between mt-2 text-xs font-medium text-slate-500">
           <span className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-blue-600"></div> 
             {formatCompactNumber(totalReleased)} Released
           </span>
           <span className="flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-slate-200"></div> 
             {formatCompactNumber(totalPending)} Pending
           </span>
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2 space-y-3">
        {provinceData.map((item) => {
          const provinceTotal = item.stipendReleased + item.pendingAmount;
          const percentDone = provinceTotal > 0 ? (item.stipendReleased / provinceTotal) * 100 : 0;
          
          return (
            <div 
              key={item.province} 
              onClick={() => handleProvinceClick(item.province)}
              className="group border border-slate-200 rounded-lg p-3 bg-white hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer"
            >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold flex items-center gap-2 text-slate-700 group-hover:text-blue-700 transition-colors">
                      <MapPin className="h-4 w-4 text-slate-400 group-hover:text-blue-500" /> 
                      {item.province}
                    </span>
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-slate-600">
                         {Math.round(percentDone)}%
                       </span>
                       <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${percentDone === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${percentDone}%` }} 
                    />
                  </div>
                  
                  <div className="flex justify-between text-[10px] mt-1">
                     <span className="text-slate-400">
                       <strong className="text-slate-600">{formatCompactNumber(item.stipendReleased)}</strong> / {formatCompactNumber(provinceTotal)}
                     </span>
                     <span className={item.pendingAmount > 0 ? "text-orange-600 font-medium" : "text-emerald-600 font-medium"}>
                        {item.pendingAmount > 0 ? `${formatCompactNumber(item.pendingAmount)} Pending` : 'Completed'}
                     </span>
                  </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}