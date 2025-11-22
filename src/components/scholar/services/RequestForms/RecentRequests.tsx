'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import type { SubmissionStatus, RequestFormType } from '@/types/services';

const mockRequests = [
  {
    id: 1,
    type: 'Letter of Endorsement' as RequestFormType,
    reason: 'OJT Application for Accenture',
    status: 'Pending' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: 'Certificate of Scholarship' as RequestFormType,
    reason: 'Opening of Landbank Account',
    status: 'Approved' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface RecentRequestsProps {
  onViewDetails: (request: any) => void;
}

export function RecentRequests({ onViewDetails }: RecentRequestsProps) {
  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Activity
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
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {req.type}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {req.reason}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {formatRelativeTime(req.dateSubmitted)}
                    </p>
                  </div>
                  <StatusBadge status={req.status} className="ml-2 shrink-0" />
                </Button>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent requests found.
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}