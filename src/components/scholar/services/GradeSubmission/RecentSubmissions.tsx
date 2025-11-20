'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import type { SubmissionStatus, Semester, SemesterAvailability } from '@/types';
import { Button } from '@/components/ui/button';

const yearLabels: { [key: number]: string } = {
  1: 'First Year',
  2: 'Second Year',
  3: 'Third Year',
  4: 'Fourth Year',
  5: 'Fifth Year',
};

// Extended type for mock data
interface MockActivity extends SemesterAvailability {
  id: number;
  dateSubmitted: string; 
}

const mockActivities: MockActivity[] = [
  {
    id: 1,
    status: 'Resubmit' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    year: 3,
    semester: '2nd Semester' as Semester,
    academicYear: 'AY 2024-2025', 
    isAvailable: true, isCurrent: true, isPast: false, isFuture: false,
  },
  {
    id: 2,
    status: 'Approved' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    year: 3,
    semester: '1st Semester' as Semester,
    academicYear: 'AY 2024-2025', 
    isAvailable: true, isCurrent: false, isPast: true, isFuture: false,
  },
  {
    id: 3,
    status: 'Pending' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    year: 2,
    semester: '2nd Semester' as Semester,
    academicYear: 'AY 2023-2024',
    isAvailable: true, isCurrent: false, isPast: true, isFuture: false,
  },
];

interface RecentSubmissionsProps {
  onSelectSubmission: (semester: SemesterAvailability) => void;
}

export function RecentSubmissions({ onSelectSubmission }: RecentSubmissionsProps) {

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Submissions
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-gray-200">
          {mockActivities.length > 0 ? (
            mockActivities.map((activity) => (
              <li key={activity.id} className="py-1 last:pb-0 first:pt-0">
                <Button
                  variant="ghost"
                  className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50"
                  onClick={() => onSelectSubmission(activity)}
                >
                  <div className="flex-1 min-w-0">
                    {/* Title: Year Level (e.g. Third Year) - Semester */}
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {yearLabels[activity.year] || `${activity.year}th Year`} - {activity.semester} | {activity.academicYear}
                    </p>
                    
                    
                    {/* Date Submitted Display */}
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted {formatRelativeTime(activity.dateSubmitted)}
                    </p>
                  </div>

                  {/* Status Badge Display */}
                  <StatusBadge
                    status={activity.status} 
                    className="ml-2 shrink-0"
                  />
                </Button>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent grade submissions found.
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}