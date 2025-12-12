'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'; 
import type { SubmissionStatus, RequestFormType } from '@/types/services';
import { useCurrentRequest } from '@/hooks/scholar/Request Forms/useCurrentRequest';

interface RecentRequestsProps {
  onViewDetails: (request: any) => void;
  refreshTrigger: number; // New Prop
}

export function RecentRequests({ onViewDetails, refreshTrigger }: RecentRequestsProps) {
  // Pass trigger to hook
  const { data: requests, loading } = useCurrentRequest(refreshTrigger);

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
             <Loader2 className="h-6 w-6 animate-spin text-dost-blue" />
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {requests && requests.length > 0 ? (
              requests.map((req) => (
                <li key={req.id} className="py-1 last:pb-0 first:pt-0">
                  <Button
                    variant="ghost"
                    className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50"
                    onClick={() => onViewDetails({
                        ...req,
                        type: req.requested_document as RequestFormType, 
                        dateSubmitted: req.requested_at
                    })}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {req.requested_document}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {req.reason}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Submitted {formatRelativeTime(req.requested_at)}
                      </p>
                    </div>
                    <StatusBadge status={req.status as SubmissionStatus} className="ml-2 shrink-0" />
                  </Button>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent requests found.
              </p>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}