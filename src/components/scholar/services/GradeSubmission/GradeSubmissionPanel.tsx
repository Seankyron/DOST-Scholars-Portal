'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { SemesterGrid } from './SemesterGrid';
import { RecentSubmissions } from './RecentSubmissions';
import { GradeSubmissionModal } from './GradeSubmissionModal';
import { toast } from '@/components/ui/toaster';
import { Select } from '@/components/ui/select';
import { useCurrentScholarGrade, type iGradeSubmissions } from '@/hooks/scholar/Grade Submission/useCurrentScholarGrade';
import type { SemesterAvailability, SubmissionStatus, Semester } from '@/types';

// 1. Constants
const jlssScholarships = ["JLSS, RA 7687", "JLSS, Merit", "JLSS, RA 10612"];

// 2. Helper: Generate Academic Year Options
function GetAcademicYearOptions(batch: number, scholarshipType: string, courseDuration: number) {
  // Logic: If JLSS, duration is usually shorter (2 or 3 years), else use full course duration
  // Adjust this logic based on your exact business rules for JLSS vs Merit/RA7687
  const scholarshipDuration = jlssScholarships.includes(scholarshipType)
    ? (courseDuration === 4 ? 2 : 3)
    : courseDuration;

  // Generate array of years
  const options = Array.from({ length: scholarshipDuration }, (_, i) => {
    // Example: Batch 2021, Duration 4
    // i=0: 2021 + 0 = 2021 -> AY 2021-2022 (Year 1)
    // i=3: 2021 + 3 = 2024 -> AY 2024-2025 (Year 4)
    const startYear = batch + i;
    const label = `AY ${startYear}-${startYear + 1}`;
    return { value: label, label, year: i + 1 }; // year is 1-based index
  });

  // Return reversed so latest year is first
  return options.reverse();
}

// 3. Helper: Transform DB Data into UI Semesters
function GetGradeRecordBySemester(
  midyearClasses: number[],
  academicYearOptions: { label: string; value: string; year: number }[],
  grade?: iGradeSubmissions[] | null
) {
  // 1. Determine the "Current" academic year based on system time
  const currentSystemYear = new Date().getFullYear(); 
  
  // Optional: You can make this more precise by checking the month
  // e.g., if (month < 6) currentSystemYear = currentSystemYear - 1;

  const semesters: Semester[] = ['1st Semester', '2nd Semester', 'Midyear'];

  const gradeRecords: SemesterAvailability[] = academicYearOptions.flatMap((option) => {
    const semCount = midyearClasses.includes(option.year) ? 3 : 2;
    
    // Extract 2024 from "AY 2024-2025"
    const academicYearStart = parseInt(option.label.split(' ')[1].split('-')[0]);

    return semesters.slice(0, semCount).map((semester) => {
      // Check if DB has data for this slot
      const entry = grade?.find(
        (i) => i.semester === semester && i.year_level === option.year
      );

      // --- LOCKING LOGIC STARTS HERE ---
      let status: SubmissionStatus = 'Not Available'; // Default to Locked

      if (entry) {
        // CASE 1: Data exists. Use the real status.
        status = entry.status as SubmissionStatus;
      }
      // --- LOCKING LOGIC ENDS HERE ---

      return {
        academicYear: option.label,
        // isAvailable controls the UI visual (grayed out vs colored)
        isAvailable: status !== 'Not Available',
        isCurrent: academicYearStart === currentSystemYear,
        isFuture: academicYearStart > currentSystemYear,
        isPast: academicYearStart < currentSystemYear,
        semester,
        status: status,
        year: option.year,
        gradeFileKey: entry?.grade_file_key ?? null,
        corFileKey: entry?.cor_file_key ?? null,
      };
    });
  });

  return gradeRecords;
}

export function GradeSubmissionPanel() {
  const storedScholar = sessionStorage.getItem('scholar');
  const scholar = storedScholar ? JSON.parse(storedScholar) : null;
  const ojt = scholar?.ojt as OjtData | null;
  const duration: 4 | 5 = (scholar?.course_duration as 4 | 5) ?? 4;
  const { grade } = useFetchGrades(scholar.spas_id);

  const curriculum: CurriculumConfig = {
    midyearYears: scholar?.midyear_classes ?? [], 
    thesisYear: scholar?.thesis_year ?? 4,
    ojtYear: ojt?.year ?? 3,
    ojtSemester: ojt?.semester ?? 'Midyear',
    duration: duration, 
  }

  const academicYearMapping = GetAcademicYearMapping(scholar?.scholarship_type, duration, scholar?.year_awarded);
  const submissionStatus = GetSubmissionStatus(scholar.scholarship_type, duration, grade, scholar.year_awarded);
  const generatedSemesters = GenerateSemester(curriculum, academicYearMapping, submissionStatus);

  const academicYearOptions = Object.values(academicYearMapping)
    .map(ay => ({ value: ay, label: ay }))
    .reverse();

  const [selectedSemester, setSelectedSemester] = useState<SemesterAvailability | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // 1. Get User Data safely
  const userStr = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  // If no user, return early or show loading (prevents crash)
  if (!user) return <div className="p-4 text-center">Loading user data...</div>;

  // 2. Generate Options
  const acadYearOptions = GetAcademicYearOptions(
    Number(user.batch), // Ensure this matches DB column name
    user.scholarship_type,
    user.course_duration
  );

  // 3. State for Dropdown
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(acadYearOptions[0]?.label || '');

  // 4. Fetch Grade Data
  const { grade, loading } = useCurrentScholarGrade();
  console.log(grade)
  // 5. Calculate Grid Data
  const gradeRecord = GetGradeRecordBySemester(
    user.midyear_classes || [], // Ensure array
    acadYearOptions,
    grade
  );

  // 6. Handlers
  const handleOpenModal = (semester: SemesterAvailability) => {
    // STRICT LOCK: Do not open if status is 'Not Available'
    if (semester.status !== 'Not Available') {
      setSelectedSemester(semester);
      setIsClosing(false);
    } else {
      // Optional: Give specific feedback based on why it's locked
      if (semester.isFuture) {
        toast.info(`You cannot submit grades for a future semester yet.`);
      } else if (semester.isPast) {
        toast.error(`Submission for this semester is closed. Please contact your coordinator.`);
      } else {
        toast.info('This semester is currently locked.');
      }
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedSemester(null);
      setIsClosing(false);
    }, 250); // Match animation duration
  };

  // 7. Filter for Grid Display
  const filteredSemesters = gradeRecord.filter(
    (sem) => sem.academicYear === selectedAcademicYear
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Grade Submission
      </h2>

      <Card className="bg-dost-title/5 border-dost-title/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-bold text-dost-title flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5" />
            Guidelines & Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700">
          <p>
            Scholars must submit their grades and registration forms at the end of every semester to process their stipend. Ensure all documents are clear and readable.
          </p>
          <div className="bg-white/60 p-4 rounded-lg border border-blue-100">
            <ul className="space-y-2 list-disc list-inside text-gray-700">
              <li><strong>Certified True Copy of Grades</strong> from the University Registrar.</li>
              <li><strong>Certificate of Registration (Form 5)</strong> for the semester.</li>
              <li>Files must be clear scanned copies (PDF preferred).</li>
              <li>Registrar's official seal and signature must be visible.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-xs">
        <Select
          label="Select Academic Year"
          value={selectedAcademicYear}
          onChange={(e) => setSelectedAcademicYear(e.target.value)}
          options={acadYearOptions}
        />
      </div>

      {/* Grid Display */}
      <SemesterGrid
        semesters={filteredSemesters}
        onSelectSemester={handleOpenModal}
        academicYear={selectedAcademicYear}
      />

      {/* Recent Submissions Feed */}
      <RecentSubmissions onSelectSubmission={handleOpenModal} />

      {/* Modal */}
      {(selectedSemester || isClosing) && (
        <GradeSubmissionModal
          isOpen={!!selectedSemester && !isClosing}
          onClose={handleCloseModal}
          semester={selectedSemester!}
          spasID={scholar?.spas_id}
        />
      )}
    </div>
  );
}