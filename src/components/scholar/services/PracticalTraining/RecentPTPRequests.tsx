'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import type { SubmissionStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { PTPTransactionType } from './PracticalTrainingPanel';

// Mock Data for PTP
const mockRequests = [
  {
    id: 1,
    type: 'Program Completion' as PTPTransactionType,
    // Use a property to distinguish if it's completion so the panel knows which form to open
    trainingCompletion: true, 
    status: 'Resubmit' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    adminComment: 'Please ensure your DTR is signed by your supervisor.',
    // Mock file existence
    files: { form126: true, form127: true, form128: true, dtr: true, certCompletion: true }
  },
  {
    id: 2,
    type: 'Referral Letter' as PTPTransactionType,
    trainingCompletion: false,
    status: 'Approved' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    adminComment: 'Referral letter sent to your email.',
    files: { grades: true, replySlip: true }
  },
];

interface RecentPTPRequestsProps {
  onViewDetails: (request: any) => void;
}

export function RecentPTPRequests({ onViewDetails }: RecentPTPRequestsProps) {
  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Transactions
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
                    {/* Title: Transaction Type */}
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {req.type}
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
              No recent practical training transactions found.
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}