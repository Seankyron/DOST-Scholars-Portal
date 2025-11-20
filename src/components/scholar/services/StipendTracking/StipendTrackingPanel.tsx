'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Wallet, Loader2 } from 'lucide-react';
import { StipendSemCard } from './StipendSemCard';
import { StipendDetailsModal } from './StipendDetailsModal';
import { RecentStipendActivity } from './RecentStipendReleases';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/toaster';
import { useCurrentScholarStipend } from '@/hooks/scholar/useCurrentScholarStipend';
import type { SubmissionStatus, Semester } from '@/types';

// --- Helper to generate the grid of expected semesters ---
const getExpectedSemesters = (
  startYear: number, 
  duration: number, 
  midyearClasses: number[] = []
) => {
  const semesters = [];
  for (let i = 0; i < duration; i++) {
    const yearLevel = i + 1;
    const acadYearStart = startYear + i;
    const acadYearLabel = `AY ${acadYearStart}-${acadYearStart + 1}`;

    // 1st Sem
    semesters.push({
      id: `${yearLevel}-1`,
      yearLevel: yearLevel,
      semester: '1st Semester' as Semester,
      academicYear: acadYearLabel,
      yearTitle: `${yearLevel}${getOrdinal(yearLevel)} Year`,
    });

    // 2nd Sem
    semesters.push({
      id: `${yearLevel}-2`,
      yearLevel: yearLevel,
      semester: '2nd Semester' as Semester,
      academicYear: acadYearLabel,
      yearTitle: `${yearLevel}${getOrdinal(yearLevel)} Year`,
    });

    // Midyear (if applicable)
    if (midyearClasses.includes(yearLevel)) {
      semesters.push({
        id: `${yearLevel}-Midyear`,
        yearLevel: yearLevel,
        semester: 'Midyear' as Semester,
        academicYear: acadYearLabel,
        yearTitle: `${yearLevel}${getOrdinal(yearLevel)} Year`,
      });
    }
  }
  // Reverse to show latest first
  return semesters.reverse();
};

const getOrdinal = (n: number) => {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
};

export function StipendTrackingPanel() {
  // 1. Get User Context
  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  // 2. Fetch Real Data
  const { stipend: stipendRecords, loading, error } = useCurrentScholarStipend(user?.spas_id);

  // 3. State
  const [selectedSemesterData, setSelectedSemesterData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterAcademicYear, setFilterAcademicYear] = useState('All');

  // 4. Process Data (Merge Structure with DB Records)
  const processedSemesters = useMemo(() => {
    if (!user) return [];

    // Generate the skeleton structure based on user's course duration
    const skeleton = getExpectedSemesters(
      Number(user.year_awarded), // Ensure this matches your DB column for Batch/Year Awarded
      user.course_duration,
      user.midyear_classes
    );

    // Merge with real data
    return skeleton.map((sem) => {
      // Find matching record in DB
      const record = stipendRecords?.find(
        (r) => r.year_level === sem.yearLevel && r.semester === sem.semester
      );

      // Determine Status
      let status = 'Not Available'; // Default if no record and in future
      let received = 0;
      let pending = 0;
      let breakdown = [];

      if (record) {
        status = record.status || 'Processing'; // Use DB status
        received = record.received || 0;
        pending = record.unreleased || 0; // Assuming 'unreleased' column exists
        // If you have a JSON column for breakdown, parse it here:
        // breakdown = record.breakdown || []; 
      } else {
        // Simple logic for "Locked" vs "Not Available"
        // You can enhance this with date comparisons if needed
        status = 'Locked'; 
      }

      return {
        ...sem,
        stipendStatus: status,
        data: {
          received,
          pending,
          total: received + pending,
          // Pass raw record data for the modal
          dbRecord: record 
        }
      };
    });
  }, [user, stipendRecords]);

  // 5. Filter Logic
  const filteredSemesters = filterAcademicYear === 'All'
    ? processedSemesters
    : processedSemesters.filter((s) => s.academicYear === filterAcademicYear);

  // 6. Generate Filter Options
  const academicYearOptions = Array.from(new Set(processedSemesters.map(s => s.academicYear)));

  // 7. Derive Recent Activity
  const recentActivities = useMemo(() => {
    if (!stipendRecords) return [];
    return stipendRecords
      .filter(r => r.received > 0) // Only show releases
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5) // Top 5
      .map((r, index) => ({
        id: index,
        title: `${r.year_level}${getOrdinal(r.year_level)} Year - ${r.semester}`,
        amount: `₱${r.received.toLocaleString()}`,
        date: new Date(r.updated_at).toLocaleDateString(),
        status: 'Released'
      }));
  }, [stipendRecords]);

  // 8. Handlers
  const handleCardClick = (sem: any) => {
    if (sem.stipendStatus === 'Locked' || sem.stipendStatus === 'Not Available') {
      toast.info("No stipend record available for this semester yet. Please ensure your grades are approved.");
      return;
    }
    setSelectedSemesterData(sem);
    setIsModalOpen(true);
  };

  if (!user) return <div>Loading user context...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Stipend Tracking
      </h2>

      {/* 1. Guidelines Card */}
      <Card className="bg-dost-title/5 border-dost-title/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-dost-title flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            Stipends are processed only after your <strong>Grade Submission</strong> for the corresponding semester has been approved.
          </p>
          <div className="bg-white/60 p-4 rounded-lg border border-blue-100 flex gap-4 items-start">
            <Wallet className="h-10 w-10 text-dost-blue flex-shrink-0" />
            <div>
              <p className="font-semibold text-dost-title mb-1">Processing Time</p>
              <p className="text-gray-600">Please allow <strong>22 working days</strong> after grade approval for processing. Statuses are updated automatically.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Filters */}
      <div className="w-full max-w-xs">
        <Select
          label="Filter by Academic Year"
          value={filterAcademicYear}
          onChange={(e) => setFilterAcademicYear(e.target.value)}
          options={[
            { value: 'All', label: 'View All' },
            ...academicYearOptions.map(ay => ({ value: ay, label: ay }))
          ]}
        />
      </div>

      {/* 3. Content Area */}
      {loading ? (
         <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-dost-blue" />
         </div>
      ) : (
        <>
          {/* Semester Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSemesters.map((sem) => (
              <StipendSemCard 
                key={sem.id}
                title={`${sem.yearTitle} - ${sem.semester}`}
                subtitle={sem.academicYear}
                status={sem.stipendStatus as any}
                amountReleased={sem.data.received}
                onClick={() => handleCardClick(sem)}
              />
            ))}
          </div>

          {/* Recent Activity List */}
          {recentActivities.length > 0 && (
            <RecentStipendActivity activities={recentActivities} />
          )}
        </>
      )}

      {/* 4. Details Modal */}
      {selectedSemesterData && (
        <StipendDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${selectedSemesterData.yearTitle} - ${selectedSemesterData.semester}`}
          // Pass the merged data to the modal
          data={selectedSemesterData.data}
        />
      )}
    </div>
  );
}