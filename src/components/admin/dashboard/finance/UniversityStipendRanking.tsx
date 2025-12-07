import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { School, TrendingUp } from 'lucide-react';

interface UniversityProps {
  data: {
    name: string;
    amount: number;
    scholarCount: number;
  }[];
}

export function UniversityStipendRanking({ data }: UniversityProps) {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0 }).format(val);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5 text-indigo-600" />
          University Allocation
        </CardTitle>
        <CardDescription>Top funding destinations this semester.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((uni, index) => (
            <div key={uni.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{uni.name}</p>
                  <p className="text-xs text-slate-500">{uni.scholarCount} Scholars</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-700">{formatCurrency(uni.amount)}</p>
                <div className="h-1.5 w-16 bg-slate-100 rounded-full ml-auto mt-1 overflow-hidden">
                   <div 
                     className="h-full bg-indigo-500 rounded-full" 
                     style={{ width: `${(uni.amount / data[0].amount) * 100}%` }}
                   />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}