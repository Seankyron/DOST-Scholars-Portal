'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { SubmissionStatus } from '@/types/services'; 
import { useCurrentThesis } from '@/hooks/scholar/Thesis Allowance/useCurrentThesis';
import { ThesisPercentage } from './ThesisAllowancePanel';

export interface ThesisRequest {
  id: number | string;
  type: "90%" | "10%" | "100%";
  status: SubmissionStatus;
  dateSubmitted: string;
  adminComment?: string;
}

interface RecentThesisSubmissionsProps {
  onViewDetails: (request: any) => void;
}

export function RecentThesisSubmissions({ onViewDetails }: RecentThesisSubmissionsProps) {
  // 1. Fetch Data for both transaction types independently
  const { data: data90, loading: loading90 } = useCurrentThesis('90%')
  const { data: data10, loading: loading10 } = useCurrentThesis('10%')
  const { data: data100, loading: loading100 } = useCurrentThesis('100%')

  const isLoading = loading90 || loading10 || loading100;

  const thesisRequests = [];

  // 2. Combine and normalize the data
  if (data90) {
    thesisRequests.push({
      ...data90,
      type: '90%' as ThesisPercentage,
      dateSubmitted: data90.created_at,
    });
  }

  if (data10) {
    thesisRequests.push({
      ...data10,
      type: '10%' as ThesisPercentage,
      dateSubmitted: data10.created_at,
    });
  }

  if (data100) {
    thesisRequests.push({
      ...data100,
      type: '100%' as ThesisPercentage,
      dateSubmitted: data100.created_at,
    });
  }

  // 3. Sort by Date (Newest First)
  const sortedRequests = thesisRequests.sort((a: any, b: any) => {
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
                        {req.type} Thesis Allowance
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