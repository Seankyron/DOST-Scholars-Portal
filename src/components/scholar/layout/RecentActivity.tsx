'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import type { SubmissionStatus } from '@/types';
import { useServicePanelContext } from '@/context/ServicePanelContext';
import type { ServiceId } from '@/hooks/useServicePanel';

const mockActivities = [
  {
    id: 1,
    title: 'Grade Submission - 4th Year | 2nd Semester',
    status: 'Approved' as SubmissionStatus,
    serviceId: 'grade-submission' as ServiceId, // <-- ADDED
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
  },
  {
    id: 2,
    title: 'Travel Clearance - Brunei Exchange Program',
    status: 'Processing' as SubmissionStatus,
    serviceId: 'travel-clearance' as ServiceId, // <-- ADDED
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: 'Thesis Allowance Request',
    status: 'Resubmit' as SubmissionStatus,
    serviceId: 'thesis-allowance' as ServiceId, // <-- ADDED
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    title: 'Reimbursement - OJT Fare',
    status: 'Resubmit' as SubmissionStatus, // Changed from Rejected
    serviceId: 'reimbursement' as ServiceId, // <-- ADDED
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    title: 'Request Form - Letter of Endorsement',
    status: 'Pending' as SubmissionStatus,
    serviceId: 'request-forms' as ServiceId, // <-- ADDED
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    title: 'Grade Submission - 4th Year | 1st Semester',
    status: 'Approved' as SubmissionStatus,
    serviceId: 'grade-submission' as ServiceId, // <-- ADDED
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    title: 'Practical Training Program - Referral',
    status: 'Approved' as SubmissionStatus,
    serviceId: 'practical-training' as ServiceId, // <-- ADDED
    timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function RecentActivity() {
  const { openPanel } = useServicePanelContext();

  const handleActivityClick = (activity: (typeof mockActivities)[0]) => {
    if (activity.serviceId) {
      openPanel(activity.serviceId);
    } else {
      toast.info(`This activity (${activity.title}) does not have a linked service.`);
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
          {mockActivities.map((activity) => (
            <li
              key={activity.id}
              className="list-none border-b border-gray-200 last:border-b-0"
            >
              <Button
                variant="ghost"
                className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg"
                // --- 5. Update the onClick handler ---
                onClick={() => handleActivityClick(activity)}
              >
                {/* Left side: Title and Time */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>

                {/* Right side: Status Badge (Pill) */}
                <StatusBadge
                  status={activity.status} 
                  className="ml-2 shrink-0"
                />
              </Button>
            </li>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}