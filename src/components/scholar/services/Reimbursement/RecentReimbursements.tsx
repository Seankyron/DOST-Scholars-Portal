'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import type { SubmissionStatus } from '@/types/services';
import { useFetchReimbursement } from '@/hooks/scholars/Get/useFetchReimbursement';

// Mock Data
const mockRequests = [
  {
    id: 1,
    type: 'Tuition Fee',
    amount: 15000,
    status: 'Pending' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: 'Transportation Allowance',
    amount: 2500,
    status: 'Approved' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: 'Review Fee',
    amount: 5000,
    status: 'Resubmit' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

interface RecentReimbursementsProps {
  onViewDetails: (request: any) => void;
}

export function RecentReimbursements({ onViewDetails }: RecentReimbursementsProps) {
  const storedScholar = sessionStorage.getItem('scholar');
  const scholar = storedScholar ? JSON.parse(storedScholar) : null;

  const { data, success, error } = useFetchReimbursement(scholar?.spas_id, 5);
  console.log('Data:', data);

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Transaction History
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-gray-200">
          {!data || data.length === 0 ?  (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent reimbursement requests found.
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
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                        {req.type}
                        </p>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {formatCurrency(req.amount)}
                        </span>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {formatRelativeTime(req.updated_at)}
                    </p>
                  </div>

                  <StatusBadge status={req.status as SubmissionStatus} className="ml-2 shrink-0" />
                </Button>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}