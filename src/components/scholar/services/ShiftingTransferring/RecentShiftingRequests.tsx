'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import type { SubmissionStatus, ShiftingType } from '@/types';
import { Button } from '@/components/ui/button';

// Mock Data
const mockRequests = [
  {
    id: 1,
    type: 'Shifting Course' as ShiftingType,
    details: 'BS Computer Science',
    status: 'Pending' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 2,
    type: 'Transferring School' as ShiftingType,
    details: 'Cavite State University - Indang',
    status: 'Approved' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
  }
];

interface RecentShiftingRequestsProps {
  onViewDetails: (request: any) => void;
}

export function RecentShiftingRequests({ onViewDetails }: RecentShiftingRequestsProps) {
  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Applications
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
                    {/* Title */}
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {req.type}
                    </p>
                    
                    {/* Subtitle/Details */}
                    <p className="text-xs text-gray-500 truncate">
                        {req.details}
                    </p>

                    {/* Date */}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {formatRelativeTime(req.dateSubmitted)}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <StatusBadge status={req.status} className="ml-2 shrink-0" />
                </Button>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent applications found.
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}