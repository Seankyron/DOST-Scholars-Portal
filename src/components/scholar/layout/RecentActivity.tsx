'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { useServicePanelContext } from '@/context/ServicePanelContext';
import { useCurrentScholar } from '@/hooks/scholar/useCurrentScholar';
import { createClient } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { DashboardActivity, SubmissionStatus } from '@/types/services';
import type { ServiceId } from '@/hooks/useServicePanel';

// Helper function to map DB types to Service IDs
const getServiceId = (type: string | null): ServiceId | undefined => {
  if (!type) return undefined;
  switch (type) {
    case 'Grade Submission':
      return 'grade-submission';
    case 'Travel Clearance':
      return 'travel-clearance';
    case 'Thesis Allowance':
      return 'thesis-allowance';
    case 'Reimbursement':
      return 'reimbursement';
    case 'Request Forms':
      return 'request-forms';
    case 'PTP Submission':
    case 'Practical Training':
      return 'practical-training';
    case 'Leave of Absence':
      return 'leave-of-absence';
    case 'Shifting Course':
      return 'shifting-transferring';
    case 'Stipend Tracking':
      return 'stipend-tracking';
    case 'Scholar Support and Feedback Mechanism':
      return 'support-feedback';
    default:
      return undefined;
  }
};

export function RecentActivity() {
  const { openPanel } = useServicePanelContext();
  const { user, loading: userLoading } = useCurrentScholar();
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.spas_id) return;

      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('all_transactions_view')
          .select('*')
          .eq('spas_id', user.spas_id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        const mappedActivities: DashboardActivity[] = (data || []).map((item) => ({
          id: item.id || crypto.randomUUID(),
          type: item.type || 'Unknown Service',
          title: item.activity || 'Untitled Activity',
          subtitle: '', // View currently doesn't provide a subtitle/description column
          status: (item.status as SubmissionStatus) || 'Pending',
          serviceId: getServiceId(item.activity) as ServiceId,
          date: item.created_at || new Date().toISOString(),
        }));

        setActivities(mappedActivities);
        console.log(mappedActivities)
      } catch (err) {
        console.error('Error fetching activities:', err);
        // Silent error or toast if needed
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      if (user) {
        fetchActivities();
      } else {
        setLoading(false);
      }
    }
  }, [user, userLoading]);

  const handleActivityClick = (activity: DashboardActivity) => {
    if (activity.serviceId) {
      openPanel(activity.serviceId);
    } else {
      toast.info(`This activity does not have a linked service panel.`);
    }
  };

  if (userLoading || (loading && !activities.length)) {
    return (
      <Card className="h-full shadow-md bg-white flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-dost-title mb-4">
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <LoadingSpinner className="w-8 h-8 text-dost-blue" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-md bg-white flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold text-dost-title mb-4">
          Recent Activities
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-hidden flex-1">
        <div className="h-full max-h-full overflow-y-auto scrollbar-thin pr-2">
          {activities.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity.id} className="py-1 last:pb-0 first:pt-0">
                  <Button
                    variant="ghost"
                    className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      {/* Top Line: Type and Title */}
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-dost-title uppercase tracking-wider">
                          {activity.title}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {activity.type}
                      </p>

                      {/* Subtitle (if exists) */}
                      {activity.subtitle && (
                        <p className="text-xs text-gray-500 truncate">
                          {activity.subtitle}
                        </p>
                      )}

                      {/* Timestamp */}
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatRelativeTime(activity.date)}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <StatusBadge
                      status={activity.status}
                      className="shrink-0 scale-90 origin-right"
                    />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-sm">No recent activities found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}