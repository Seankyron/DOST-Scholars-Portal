// src/components/scholar/services/SupportFeedback/FeedbackHistory.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import type { SubmissionStatus } from '@/types/services';
import { useFetchFeedback } from '@/hooks/scholars/Get/useFetchFeedback';

// Mock Data
const mockHistory = [
  {
    id: 1,
    category: 'Technical Issue',
    description: 'Cannot upload file for Grade Submission',
    status: 'Pending' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: 2,
    category: 'Scholarship Inquiry',
    description: 'Clarification on Thesis Allowance requirements',
    status: 'Approved' as SubmissionStatus, // Used as "Resolved"
    dateSubmitted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    adminResponse: 'Please refer to the Thesis Allowance guidelines in the Downloadables section.'
  }
];

interface FeedbackHistoryProps {
  onViewDetails: (item: any) => void;
}

export function FeedbackHistory({ onViewDetails }: FeedbackHistoryProps) {
  const storedScholar = sessionStorage.getItem('user');
  const scholar = storedScholar ? JSON.parse(storedScholar) : null;

  const { data, success, error } = useFetchFeedback(scholar.spas_id, 5);

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Ticket History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-200">
          {!data || data.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No previous tickets found.
            </p>
          ) : (
            data.map((item) => (
              <li key={item.id} className="py-1 last:pb-0 first:pt-0">
                <Button
                  variant="ghost"
                  className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50"
                  onClick={() => onViewDetails(item)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.type}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {item.reason}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {formatRelativeTime(item.updated_at ?? new Date().toISOString())}
                    </p>
                  </div>
                  <StatusBadge status={item.status as SubmissionStatus} className="ml-2 shrink-0">
                    {item.status === 'Approved' ? 'Resolved' : item.status}
                  </StatusBadge>
                </Button>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}