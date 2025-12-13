'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import type { SubmissionStatus, LOAReason } from '@/types';
import { Button } from '@/components/ui/button';
import { useFetchLoa } from '@/hooks/scholars/Get/useFetchLoa';
import { COMPILER_NAMES } from 'next/dist/shared/lib/constants';

// Mock data with Status, Date Submitted, and details for Modal View
const mockRequests = [
  {
    id: 1,
    reason: 'Medical/Personal' as LOAReason,
    reasonText: 'I need to undergo surgery for appendicitis and require recovery time.',
    semester: '1st Semester', 
    academicYear: '2024-2025',
    duration: '1 Semester',
    status: 'Resubmit' as SubmissionStatus, 
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    adminComment: 'Please attach a clearer copy of your Medical Certificate. The seal is not visible.'
  },
  {
    id: 2,
    reason: 'Exchange Student Program' as LOAReason,
    reasonText: 'Accepted into the Semester Exchange Program at National University of Singapore (NUS).',
    semester: '2nd Semester',
    academicYear: '2023-2024',
    duration: '1 Semester',
    status: 'Approved' as SubmissionStatus, 
    dateSubmitted: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
  },
  {
    id: 3,
    reason: 'Medical/Personal' as LOAReason,
    reasonText: 'Family emergency requiring me to return to my province to assist with business matters.',
    semester: '1st Semester',
    academicYear: '2025-2026',
    duration: '1 Academic Year',
    status: 'Pending' as SubmissionStatus, 
    dateSubmitted: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
];

interface RecentLOARequestsProps {
  onViewDetails: (request: any) => void;
}

export function RecentLOARequests({ onViewDetails }: RecentLOARequestsProps) {
  const storedScholar = sessionStorage.getItem('user');
  const scholar = storedScholar ? JSON.parse(storedScholar) : null;

  const { data } = useFetchLoa(scholar.spas_id, 5);

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Requests
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-gray-200">
          {!data || data.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent leave of absence requests found.
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
                    {/* Title: Reason Category - Semester | AY */}
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {req.reason}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                       {req.semester} | {req.academic_year}
                    </p>
                    
                    {/* Date Submitted Display */}
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted {formatRelativeTime(req.updated_at ?? new Date().toISOString())}
                    </p>
                  </div>

                  {/* Status Badge Display */}
                  <StatusBadge
                    status={(req.status ?? ' Pending') as SubmissionStatus} 
                    className="ml-2 shrink-0"
                  />
                </Button>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}