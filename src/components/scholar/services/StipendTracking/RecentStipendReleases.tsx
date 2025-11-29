'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

interface RecentStipendActivityProps {
  activities: any[];
  onViewDetails: (activity: any) => void;
}

export function RecentStipendActivity({ activities, onViewDetails }: RecentStipendActivityProps) {
  
  console.log("Selected Stipend Activity: ", activities);
  // 3. Helper to handle selection (Just like in RecentSubmissions)
  const handleSelect = (activity: any) => {
    // The parent component (StipendTrackingPanel) has already prepared the data 
    // to match the expected structure for the modal, so we just log and pass it.
    console.log("Selected Stipend Activity: ", activity);
    onViewDetails(activity);
  };

  return (
    <Card className="shadow-md bg-white mt-6">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Releases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-200">
          {activities.length > 0 ? (
            activities.map((act) => (
              <li key={act.id} className="py-1 last:pb-0 first:pt-0">
                <Button
                  variant="ghost"
                  className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50"
                  onClick={() => handleSelect(act)}
                >
                  {/* Left side: Title and Date */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{act.title}</p>
                    <p className="text-xs text-gray-500">{act.date}</p>
                  </div>

                  {/* Right side: Amount and Status */}
                  <div className="text-right ml-2 shrink-0">
                    <p className="text-sm font-bold text-green-700">{act.amount}</p>
                    <div className="flex justify-end mt-1">
                      <StatusBadge status={act.stipendStatus} className="scale-90 origin-right" />
                    </div>
                  </div>
                </Button>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent stipend releases found.
            </p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}