// seankyron/dost-scholars-portal/DOST-Scholars-Portal-merge/src/components/scholar/layout/RecentActivity.tsx

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { useServicePanelContext } from '@/context/ServicePanelContext';
import type { DashboardActivity } from '@/types/services'; 

// Compiled Mock Data from all services
const compiledActivities: DashboardActivity[] = [
  {
    id: 1,
    type: 'Grade Submission',
    title: '4th Year - 2nd Semester',
    subtitle: 'AY 2024-2025',
    status: 'Approved',
    serviceId: 'grade-submission',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    type: 'Travel Clearance',
    title: 'Official Business Travel',
    subtitle: 'Japan (International Conference)',
    status: 'Processing',
    serviceId: 'travel-clearance',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 3,
    type: 'Thesis Allowance',
    title: '90% Partial Release',
    subtitle: 'Abstract & Approval Sheet',
    status: 'Resubmit',
    serviceId: 'thesis-allowance',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: 'Reimbursement',
    title: 'Transportation Allowance',
    subtitle: 'OJT Daily Commute',
    status: 'Resubmit',
    serviceId: 'reimbursement',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    type: 'Request Form',
    title: 'Letter of Endorsement',
    subtitle: 'For OJT Application at Accenture',
    status: 'Pending',
    serviceId: 'request-forms',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    type: 'Practical Training',
    title: 'Referral Letter',
    subtitle: 'Request for Endorsement',
    status: 'Approved',
    serviceId: 'practical-training',
    date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    type: 'Shifting/Transferring',
    title: 'Shifting Course',
    subtitle: 'BS Computer Science',
    status: 'Pending',
    serviceId: 'shifting-transferring',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function RecentActivity() {
  const { openPanel } = useServicePanelContext();

  const handleActivityClick = (activity: DashboardActivity) => {
    if (activity.serviceId) {
      openPanel(activity.serviceId);
    } else {
      toast.info(`This activity does not have a linked service panel.`);
    }
  };

  return (
    <Card className="h-full shadow-md bg-white flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold text-dost-title mb-4">
          Recent Activities
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-hidden flex-1">
        <div className="h-full max-h-full overflow-y-auto scrollbar-thin pr-2">
          {compiledActivities.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {compiledActivities.map((activity) => (
                <li key={activity.id} className="py-1 last:pb-0 first:pt-0">
                  <Button
                    variant="ghost"
                    className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      {/* Top Line: Type and Title */}
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-dost-blue uppercase tracking-wider">
                          {activity.type}
                        </span>
                      </div>
                      
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {activity.title}
                      </p>
                      
                      {/* Subtitle (if exists) */}
                      {activity.subtitle && (
                        <p className="text-xs text-gray-500 truncate">
                          {activity.subtitle}
                        </p>
                      )}
                      
                      {/* Timestamp */}
                      <p className="text-[10px] text-gray-400 mt-1">
                        Submitted {formatRelativeTime(activity.date)}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <StatusBadge
                      status={activity.status}
                      className="shrink-0 scale-90 origin-right"
                    />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-500">
               <p className="text-sm">No recent activities found.</p>
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}