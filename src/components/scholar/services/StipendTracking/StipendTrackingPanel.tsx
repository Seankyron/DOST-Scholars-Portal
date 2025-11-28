'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Wallet, Loader2 } from 'lucide-react';
import { StipendSemCard } from './StipendSemCard';
import { StipendDetailsModal } from './StipendDetailsModal';
import { RecentStipendActivity } from './RecentStipendReleases';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/toaster';
import { useCurrentScholarStipend } from '@/hooks/scholar/Stipend Tracking/useCurrentScholarStipend';
import type { StipendPeriodStatus, Semester} from '@/types';
import { formatRelativeTime } from '@/lib/utils/date';

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
      yearTitle: `${getOrdinal(yearLevel)} Year`,
    });

    // 2nd Sem
    semesters.push({
      id: `${yearLevel}-2`,
      yearLevel: yearLevel,
      semester: '2nd Semester' as Semester,
      academicYear: acadYearLabel,
      yearTitle: `${getOrdinal(yearLevel)} Year`,
    });

    // Midyear (if applicable)
    if (midyearClasses.includes(yearLevel)) {
      semesters.push({
        id: `${yearLevel}-Midyear`,
        yearLevel: yearLevel,
        semester: 'Midyear' as Semester,
        academicYear: acadYearLabel,
        yearTitle: `${getOrdinal(yearLevel)} Year`,
      });
    }
  }
  // Reverse to show latest first
  return semesters.reverse();
};

const getOrdinal = (n: number) => {
  if (n === 1) return 'First';
  if (n === 2) return 'Second';
  if (n === 3) return 'Third';
  return 'Fourth';
};

export function StipendTrackingPanel() {
  // 1. Get User Context
  // Ideally this should come from a Context Provider, but session storage works for now
  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  // 2. Fetch Real Data
  const { stipend: stipendRecords, loading, error } = useCurrentScholarStipend(user?.spas_id);

  // 3. Calculate Options & Defaults (Memoized)
  // We generate the Academic Year options *before* state so we can set a default.
  const academicYearOptions = useMemo(() => {
    if (!user) return [];
    const startYear = Number(user.year_awarded);
    const duration = Number(user.course_duration) || 4;
    
    // Generate list of AY strings
    const options = Array.from({ length: duration }, (_, i) => {
      const y = startYear + i;
      return `AY ${y}-${y + 1}`;
    });
    
    // Reverse to show latest first
    return options.reverse();
  }, [user]);

  // 4. State
  const [selectedSemesterData, setSelectedSemesterData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initialize with the latest year (first option), or empty string if loading
  const [filterAcademicYear, setFilterAcademicYear] = useState(academicYearOptions[0] || '');

  // Ensure state updates if user data loads late
  useEffect(() => {
    console.log(academicYearOptions)
    if (academicYearOptions.length > 0 && !filterAcademicYear) {
      setFilterAcademicYear(academicYearOptions[0]);
    }
  }, [academicYearOptions, filterAcademicYear]);

  // 4. Process Data (Merge Structure with DB Records)
  type UIStipendStatus = StipendPeriodStatus;
  const processedSemesters = useMemo(() => {
    if (!user) return [];

    // Generate the skeleton structure based on user's course duration
    const skeleton = getExpectedSemesters(
      Number(user.year_awarded), // Ensure this matches your DB column for Batch/Year Awarded
      Number(user.course_duration) || 4, // Fallback to 4 if missing
      user.midyear_classes || []
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
      
      if (record) {
        status = (record.status as UIStipendStatus)|| 'Pending'; // Use DB status
        received = record.received || 0;
        pending = record.unreleased || 0; // Assuming 'unreleased' column exists
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

  // 6. Filter Logic (Removed 'All' check)
  const filteredSemesters = processedSemesters.filter(
    (s) => s.academicYear === filterAcademicYear
  );

// 7. Derive Recent Activity
  const recentActivities = useMemo(() => {
    if (!stipendRecords) return [];
    
    return stipendRecords
      .filter(r => r.received && r.received > 0) // Only show actual releases
      .sort((a, b) => {
         return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      })
      .map((r, index) => {
        // Find the complete semester object for this record
        const matchingSem = processedSemesters.find(
            s => s.yearLevel === r.year_level && s.semester === r.semester
        );

        const effectiveStatus = r.status || matchingSem?.stipendStatus || 'Pending';
        const yearTitle = matchingSem?.yearTitle || `${r.year_level}${getOrdinal(r.year_level)} Year`;

        // IMPORTANT: We explicitly construct the 'data' object here so it is never missing
        const modalData = {
            received: r.received || 0,
            pending: r.unreleased || 0,
            total: (r.received || 0) + (r.unreleased || 0),
            dbRecord: r 
        };

        return {
            id: index,
            // Display Fields
            title: `${yearTitle} - ${r.semester}`,
            amount: `₱${(r.received || 0).toLocaleString()}`,
            date: `Updated ${formatRelativeTime( new Date(r.updated_at))}`,
            status: effectiveStatus,
            
            // Logic Fields for Modal (Must be present!)
            stipendStatus: effectiveStatus, 
            data: modalData, // <--- This was likely missing or undefined in your object
            yearTitle: yearTitle,
            semester: r.semester
        };
      });
  }, [stipendRecords, processedSemesters]);

  // 8. Handlers
  const handleCardClick = (sem: any) => {
    // Allow clicking if status is valid
    // Adjust this condition based on your exact requirements
    const validStatuses = ['Released', 'On hold', 'Pending'];
    console.log("Includes? ", validStatuses.includes(sem.stipendStatus))
    console.log(sem.stipendStatus == 'Pending')
    console.log("Stipend Status: ", sem.stipendStatus)
    if (validStatuses.includes(sem.stipendStatus)) {
        setSelectedSemesterData(sem);
        setIsModalOpen(true);
    } else {
        toast.info("No stipend details available for this semester yet.");
    }
  };

  if (!user) return <div className="p-8 text-center text-gray-500">Loading user profile...</div>;

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
          options={academicYearOptions.map(ay => ({ value: ay, label: ay }))}
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
            <RecentStipendActivity activities={recentActivities}
            onViewDetails={handleCardClick} />
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