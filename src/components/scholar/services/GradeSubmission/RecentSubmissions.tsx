'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import type { SubmissionStatus, Semester, SemesterAvailability } from '@/types';
import { Button } from '@/components/ui/button';

const mockActivities: (SemesterAvailability & { id: number; title: string; timestamp: string })[] = [
  {
    id: 1,
    title: 'Grade Submission - 3rd Year | 2nd Semester',
    status: 'Resubmit' as SubmissionStatus,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    // Data for the modal
    year: 3,
    semester: '2nd Semester' as Semester,
    isAvailable: true, isCurrent: true, isPast: false, isFuture: false,
  },
  {
    id: 2,
    title: 'Grade Submission - 3rd Year | 1st Semester',
    status: 'Approved' as SubmissionStatus,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    // Data for the modal
    year: 3,
    semester: '1st Semester' as Semester,
    isAvailable: true, isCurrent: false, isPast: true, isFuture: false,
  },
  {
    id: 3,
    title: 'Grade Submission - 2nd Year | 2nd Semester',
    status: 'Pending' as SubmissionStatus,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    // Data for the modal
    year: 2,
    semester: '2nd Semester' as Semester,
    isAvailable: true, isCurrent: false, isPast: true, isFuture: false,
  },
];

// --- MODIFICATION: Add new prop interface ---
interface RecentSubmissionsProps {
  onSelectSubmission: (semester: SemesterAvailability) => void;
}

export function RecentSubmissions({ onSelectSubmission }: RecentSubmissionsProps) {

  const handleClick = (activity: SemesterAvailability) => {
    // --- MODIFICATION: Call the prop function ---
    onSelectSubmission(activity);
  };

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Activities
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-gray-200">
          {mockActivities.map((activity) => (
            // --- MODIFICATION: Wrap in Button and add onClick ---
            <li key={activity.id} className="py-1 last:pb-0 first:pt-0">
              <Button
                variant="ghost"
                className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg"
                onClick={() => handleClick(activity)}
              >
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
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}