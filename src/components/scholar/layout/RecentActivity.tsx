'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getStatusColor } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/toaster';

// Mock data for recent activities
const mockActivities = [
  {
    id: 1,
    title: 'Grade Submission - 4th Year | 2nd Semester',
    status: 'Approved',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    title: 'Travel Clearance - Brunei',
    status: 'Processing',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 3,
    title: 'Thesis Allowance - 90%',
    status: 'Resubmit',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 4,
    title: 'Request Form - Letter of Endorsement',
    status: 'Closed',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  },
];

export function RecentActivity() {
  return (
    <Card className="h-full shadow-md">
      <CardHeader>
        <CardTitle><h2 className="text-2xl text-center font-bold text-dost-title mb-4">
          Recent Activities
        </h2></CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockActivities.map((activity) => (
            <li key={activity.id}>
              <Button
                variant="ghost"
                className="flex h-auto w-full items-start justify-between p-2 text-left"
                onClick={() =>
                  toast.info(`Navigating to ${activity.title}... (not built)`)
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full',
                      getStatusColor(activity.status).replace(
                        /text-\w+-\d+/,
                        ''
                      )
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          getStatusColor(activity.status).replace(
                            /bg-\w+-\d+/,
                            ''
                          )
                        )}
                      >
                        {activity.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}