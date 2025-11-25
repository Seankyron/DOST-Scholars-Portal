'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PTPTransactionType } from './PracticalTrainingPanel';
import { useCurrentScholarPTP } from '@/hooks/scholar/PTP Submission/useCurrentScholarPTP';

interface RecentPTPRequestsProps {
  onViewDetails: (request: any) => void;
}

export function RecentPTPRequests({ onViewDetails }: RecentPTPRequestsProps) {
  // 1. Fetch Data for both transaction types independently
  const { data: referralData, loading: referralLoading } = useCurrentScholarPTP('Referral Letter');
  const { data: completionData, loading: completionLoading } = useCurrentScholarPTP('Program Completion');

  const isLoading = referralLoading || completionLoading;

  // 2. Combine and normalize the data
  const requests = [];

  if (referralData) {
    requests.push({
      ...referralData, // Spread all DB fields
      type: 'Referral Letter' as PTPTransactionType,
      // Ensure we have a valid date string for the helper function
      dateSubmitted: referralData.created_at,
    });
  }

  if (completionData) {
    requests.push({
      ...completionData,
      type: 'Program Completion' as PTPTransactionType,
      dateSubmitted: completionData.created_at,
    });
  }

  // 3. Sort by Date (Newest First)
  const sortedRequests = requests.sort((a: any, b: any) => {
    const dateA = new Date(a.dateSubmitted || 0).getTime();
    const dateB = new Date(b.dateSubmitted || 0).getTime();
    return dateB - dateA;
  });

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Transactions
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
             <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-dost-blue" />
             </div>
        ) : (
            <ul className="divide-y divide-gray-200">
            {sortedRequests.length > 0 ? (
                sortedRequests.map((req: any) => (
                <li key={`${req.type}-${req.id}`} className="py-1 last:pb-0 first:pt-0">
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
        )}
      </CardContent>
    </Card>
  );
}