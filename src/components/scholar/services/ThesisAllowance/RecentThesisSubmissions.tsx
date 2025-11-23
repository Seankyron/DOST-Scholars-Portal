'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import type { SubmissionStatus } from '@/types/services'; 

export interface ThesisRequest {
  id: number | string;
  percentage: 90 | 10 | 100;
  status: SubmissionStatus;
  dateSubmitted: string;
  adminComment?: string;
}

interface RecentThesisSubmissionsProps {
  onViewDetails: (request: ThesisRequest) => void;
  requests: ThesisRequest[];
}

export function RecentThesisSubmissions({ onViewDetails, requests = [] }: RecentThesisSubmissionsProps) {
  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Submissions
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-gray-200">
          {requests.length > 0 ? (
            requests.map((req) => (
              <li key={req.id} className="py-1 last:pb-0 first:pt-0">
                <Button
                  variant="ghost"
                  className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50"
                  onClick={() => onViewDetails(req)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {req.percentage}% Thesis Allowance Release
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
              No recent thesis allowance requests found.
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}