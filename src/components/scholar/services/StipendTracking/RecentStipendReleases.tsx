'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function RecentStipendActivity({ activities }: { activities: any[] }) {
  return (
    <Card className="shadow-md bg-white mt-6">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Releases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-200">
          {activities.map((act) => (
            <li key={act.id} className="py-3 flex justify-between items-center">
               <div>
                  <p className="text-sm font-semibold text-gray-900">{act.title}</p>
                  <p className="text-xs text-gray-500">{act.date}</p>
               </div>
               <div className="text-right">
                  <p className="text-sm font-bold text-green-700">{act.amount}</p>
                  <StatusBadge status={act.status} className="scale-90 origin-right" />
               </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}