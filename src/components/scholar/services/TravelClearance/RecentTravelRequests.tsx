'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import type { SubmissionStatus, TravelPurpose } from '@/types/services';
import { useFetchTravelClearance } from '@/hooks/scholars/useFetchTravelClearance';

// Mock data
const mockRequests = [
  {
    id: 1,
    purpose: 'Other' as TravelPurpose,
    destination: 'Singapore',
    departureDate: '2024-12-20',
    returnDate: '2024-12-26',
    status: 'Pending' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    purpose: 'Official Business Travel' as TravelPurpose,  //type
    destination: 'Japan (Conference)',
    departureDate: '2023-10-15',
    returnDate: '2023-10-20', // arrival
    status: 'Approved' as SubmissionStatus,
    dateSubmitted: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // updated at
  },
];

interface RecentTravelRequestsProps {
  onViewDetails: (request: any) => void;
}

export function RecentTravelRequests({ onViewDetails }: RecentTravelRequestsProps) {
  const storedScholar = sessionStorage.getItem('scholar');
  const scholar = storedScholar ? JSON.parse(storedScholar) : null;

  const { data, success, error } = useFetchTravelClearance(scholar?.spas_id);

  console.log('Data:', data);

  if (!data) return;

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Request History
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="divide-y divide-gray-200">
          {data!.length > 0 ? (
            data.map((req) => (
              <li key={req.id} className="py-1 last:pb-0 first:pt-0">
                <Button
                  variant="ghost"
                  className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50"
                  onClick={() => onViewDetails(req)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {req.destination} ({req.type === 'Other' ? 'Personal' : 'Official'})
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {formatRelativeTime(req.updated_at)}
                    </p>
                  </div>

                  <StatusBadge status={req.status as SubmissionStatus} className="ml-2 shrink-0" />
                </Button>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent travel clearance requests found.
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}