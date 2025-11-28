'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import type { SubmissionStatus, ShiftingType } from '@/types';
import { Button } from '@/components/ui/button';
import { useFetchShifting } from '@/hooks/scholars/Get/useFetchShifting';

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
  const storedScholar = sessionStorage.getItem('scholar');
  const scholar = storedScholar ? JSON.parse(storedScholar) : null;

  const { data, success, error } = useFetchShifting(scholar?.spas_id, 5);

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Applications
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-gray-200">
          { !data || data.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent applications found.
            </p>
          ) : (
            data.map((req) => (
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
                        { req.type === "Shifting Course & Transferring School" ? `${req.new_course} - ${req.new_school}`
                          : req.type === "Shifting Course" ? req.new_course
                          : req.new_school}
                    </p>

                    {/* Date */}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {formatRelativeTime(new Date(req.updated_at ?? Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),)}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <StatusBadge status={(req.status ?? 'Pending') as SubmissionStatus} className="ml-2 shrink-0" />
                </Button>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}