'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import type { SubmissionStatus } from '@/types';

// Mock data based on Page 15
const mockActivities = [
  {
    id: 1,
    title: 'Grade Submission - 3rd Year | 2nd Semester',
    status: 'Resubmit' as SubmissionStatus,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    title: 'Grade Submission - 3rd Year | 1st Semester',
    status: 'Approved' as SubmissionStatus,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 3,
    title: 'Grade Submission - 2nd Year | 2nd Semester',
    status: 'Pending' as SubmissionStatus,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

export function RecentSubmissions() {
  return (
    <Card className="shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Activities
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-gray-200">
          {mockActivities.map((activity) => (
            <li key={activity.id} className="flex items-center justify-between py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
              <StatusBadge
                status={activity.status} 
                className="ml-2 shrink-0"
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}