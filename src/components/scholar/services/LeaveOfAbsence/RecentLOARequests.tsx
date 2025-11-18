'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import type { SubmissionStatus, LOAReason } from '@/types';
import { Button } from '@/components/ui/button';

// Mock data with Status and Date Submitted
const mockRequests = [
  {
    id: 1,
    reason: 'Medical/Personal' as LOAReason,
    semester: '1st Semester', 
    academicYear: 'AY 2024-2025',
    status: 'Resubmit' as SubmissionStatus, // <--- STATUS
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // <--- DATE SUBMITTED (2 days ago)
    adminComment: 'Please attach a clearer copy of your Medical Certificate.'
  },
  {
    id: 2,
    reason: 'Exchange Student Program' as LOAReason,
    semester: '2nd Semester',
    academicYear: 'AY 2023-2024',
    status: 'Approved' as SubmissionStatus, // <--- STATUS
    dateSubmitted: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // <--- DATE SUBMITTED (30 days ago)
  },
];

interface RecentLOARequestsProps {
  onViewDetails: (request: any) => void;
}

export function RecentLOARequests({ onViewDetails }: RecentLOARequestsProps) {
  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Requests
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-gray-200">
          {mockRequests.length > 0 ? (
            mockRequests.map((req) => (
              <li key={req.id} className="py-1 last:pb-0 first:pt-0">
                <Button
                  variant="ghost"
                  className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50"
                  onClick={() => onViewDetails(req)}
                >
                  <div className="flex-1 min-w-0">
                    {/* Title: Reason - Semester | AY */}
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {req.reason} - {req.semester} | {req.academicYear}
                    </p>
                    
                    {/* Date Submitted Display */}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {formatRelativeTime(req.dateSubmitted)}
                    </p>
                  </div>

                  {/* Status Badge Display */}
                  <StatusBadge
                    status={req.status} 
                    className="ml-2 shrink-0"
                  />
                </Button>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent leave of absence requests found.
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}