'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeTime } from '@/lib/utils/date';
import type { SubmissionStatus, SemesterAvailability, Semester } from '@/types';
import { Button } from '@/components/ui/button';
import { useCurrentScholarGrade } from '@/hooks/scholar/Grade Submission/useCurrentScholarGrade';
import { Loader2 } from 'lucide-react';

const yearLabels: { [key: number]: string } = {
  1: 'First Year',
  2: 'Second Year',
  3: 'Third Year',
  4: 'Fourth Year',
  5: 'Fifth Year',
};

interface RecentSubmissionsProps {
  onSelectSubmission: (semester: SemesterAvailability) => void;
}

export function RecentSubmissions({ onSelectSubmission }: RecentSubmissionsProps) {
  // 1. Fetch all grade records for the current scholar
  const { grade, loading } = useCurrentScholarGrade();

  // 2. Filter and Sort
  const activities = (grade || [])
    .filter((item) => {
      // Filter out 'Open' status (or any null/undefined status)
      // We only want actual submissions (Pending, Approved, Resubmit, etc.)
      return item.status && item.status !== 'Open';
    })
    .sort((a, b) => {
      // Sort by most recent update
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    .slice(0, 5); // Take only the top 5 most recent

  // 3. Helper to convert DB record to SemesterAvailability for the modal
  const handleSelect = (activity: any) => {
    const semesterData: SemesterAvailability = {
      year: activity.year_level,
      semester: activity.semester as Semester,
      academicYear: 'N/A', // You might want to store/fetch this if critical, or derive it
      status: activity.status as SubmissionStatus,
      isAvailable: true,
      isCurrent: false, // These flags are less critical for viewing past submissions
      isPast: true,
      isFuture: false,
      gradeFileKey: activity.grade_file_key,
      corFileKey: activity.cor_file_key,
      comment: activity.comment,
    };
    console.log("Activity: ", activity)
    onSelectSubmission(semesterData);
  };

  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-dost-title">
          Recent Submissions
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
             <Loader2 className="h-6 w-6 animate-spin text-dost-blue" />
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <li key={activity.id} className="py-1 last:pb-0 first:pt-0">
                  <Button
                    variant="ghost"
                    className="flex h-auto w-full items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50"
                    onClick={() => handleSelect(activity)}
                  >
                    <div className="flex-1 min-w-0">
                      {/* Title: Year Level - Semester */}
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {yearLabels[activity.year_level] || `${activity.year_level}th Year`} - {activity.semester}
                      </p>
                      
                      {/* Date Submitted Display */}
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted {formatRelativeTime(activity.updated_at)}
                      </p>
                    </div>

                    {/* Status Badge Display */}
                    <StatusBadge
                      status={activity.status as SubmissionStatus} 
                      className="ml-2 shrink-0"
                    />
                  </Button>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No submitted grades found.
              </p>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}