'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { cn } from '@/lib/utils/cn';
import type { SubmissionStatus } from '@/types'; // <-- 1. Import the type

// Mock data updated to include "Rejected"
const mockActivities = [
  {
    id: 1,
    title: 'Grade Submission - 4th Year | 2nd Semester',
    status: 'Approved' as SubmissionStatus, // <-- 2. Cast the status
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    title: 'Travel Clearance - Brunei Exchange Program',
    status: 'Processing' as SubmissionStatus, // <-- 2. Cast the status
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 3,
    title: 'Thesis Allowance Request',
    status: 'Resubmit' as SubmissionStatus, // <-- 2. Cast the status
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 4,
    title: 'Reimbursement - OJT Fare',
    status: 'Rejected' as SubmissionStatus, // <-- 2. Cast the status
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: 5,
    title: 'Request Form - Letter of Endorsement',
    status: 'Pending' as SubmissionStatus, // <-- 2. Cast the status
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  },
  // Added more mock data to demonstrate scrolling
  {
    id: 6,
    title: 'Grade Submission - 4th Year | 1st Semester',
    status: 'Approved' as SubmissionStatus, // <-- 2. Cast the status
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
  },
  {
    id: 7,
    title: 'Practical Training Program - Referral',
    status: 'Approved' as SubmissionStatus, // <-- 2. Cast the status
    timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
  },
];

export function RecentActivity() {
  return (
    // Set h-full and flex properties for the Card to constrain the CardContent
    <Card className="h-full shadow-md bg-white flex flex-col">
      <CardHeader>
        {/* Title uses the consistent dost-title color */}
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
                onClick={() =>
                  toast.info(`Navigating to ${activity.title}... (not built)`)
                }
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