'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check } from 'lucide-react';
import { SemesterGrid } from './SemesterGrid';
import { RecentSubmissions } from './RecentSubmissions';
import { GradeSubmissionModal } from './GradeSubmissionModal';
import type { SemesterAvailability } from '@/types/curriculum';
import type { SubmissionStatus, CurriculumConfig, Semester } from '@/types'; 
import { hasMidyear } from '@/lib/utils/curriculum'; 
import { toast } from '@/components/ui/toaster';
import { Select } from '@/components/ui/select'; 
import { iGradeSubmissions, useFetchGrades } from '@/hooks/scholars/useFetchGrade';


type OjtData = {
  year: number;
  semester?: Semester;
};

// const mockCurriculum: CurriculumConfig = {
//   midyearYears: [1, 3], 
//   thesisYear: 4,
//   ojtYear: 3,
//   ojtSemester: 'Midyear',
//   duration: 4, 
// };


const jlssScholarships = ["JLSS, RA 7687", "JLSS, Merit", "JLSS, RA 10612",];

// ... (SubmissionStatuses and AcademicYearMapping logic remains the same) ...
// const submissionStatuses: Record<string, SubmissionStatus> = {
//   '1-1st Semester': 'Approved',
//   '1-2nd Semester': 'Approved',
//   '1-Midyear': 'Approved', 
//   '2-1st Semester': 'Approved',
//   '2-2nd Semester': 'Pending', 
//   '3-1st Semester': 'Approved',
//   '3-2nd Semester': 'Resubmit', 
//   '3-Midyear': 'Open', 
//   '4-1st Semester': 'Not Available',
//   '4-2nd Semester': 'Not Available',
// };

// const academicYearMapping: Record<number, string> = {
//   1: 'AY 2023-2024',
//   2: 'AY 2024-2025',
//   3: 'AY 2025-2026',
//   4: 'AY 2026-2027',
//   5: 'AY 2027-2028',
// };

function GetSubmissionStatus(scholarshipType: string, duration: number, grades: iGradeSubmissions[], batch: number)
{
  const submissionStatus: Record<string, SubmissionStatus> = {};
  const currentYear = new Date().getFullYear();

  // Determine year range
  const yearStart = jlssScholarships.includes(scholarshipType) ? 3 : 1;
  const yearEnd = duration;

  const semesters = ["1st Semester", "2nd Semester", "Midyear"];

  for (let year = yearStart; year <= yearEnd; year++) {
    for (const semester of semesters) {
      const grade = grades.find(
        (g) => g.year_level === year && g.semester === semester
      );
      
      submissionStatus[`${year}-${semester}`] = grade
      ? (grade.status as SubmissionStatus)
      : batch < currentYear
      ? "Resubmit"
      : "Not Available";
    }
    batch++;
  }
  return submissionStatus;
}

function GetAcademicYearMapping(scholarshipType: string, duration: number, batch: number) {

  const academicYearMapping: Record<number, string> = {};
  const startKey = jlssScholarships.includes(scholarshipType) ? 3 : 1;

  for (let key = startKey; key <= duration; key++) {
    const startYear = Number(batch) + (key - startKey) - 1;
    const endYear = startYear + 1;
    academicYearMapping[key] = `AY ${startYear}-${endYear}`;
  }
  return academicYearMapping;
} 

function GenerateSemester(curriculum: CurriculumConfig, 
                          academicYearMapping: Record<number, string>,
                          submissionStatuses: Record<string, SubmissionStatus>) 
{
  // Adaptive Semester Generation Logic
  const generatedSemesters: (SemesterAvailability & { academicYear: string })[] = [];

  for (let year = 1; year <= curriculum.duration; year++) {
    const semesters: Semester[] = ['1st Semester', '2nd Semester'];
    if (hasMidyear(curriculum, year)) semesters.push('Midyear');

    for (const sem of semesters) {
      const statusKey = `${year}-${sem}`;
      const status = submissionStatuses[statusKey] || 'Not Available';
      generatedSemesters.push({
        year: year,
        semester: sem,
        status: status,
        isAvailable: status !== 'Not Available',
        isCurrent: (year === 3 && sem === '2nd Semester'), 
        isPast: year < 3 || (year === 3 && sem === '1st Semester'), 
        isFuture: year > 3,
        academicYear: academicYearMapping[year] || 'N/A',
      });
    }
  }
  return generatedSemesters;
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
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('AY 2025-2026'); 

  const handleOpenModal = (semester: SemesterAvailability) => {
    if (semester.status !== 'Not Available') {
      setSelectedSemester(semester);
      setIsClosing(false);
    } else {
      toast.info('This semester is not yet available for submission.');
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedSemester(null);
      setIsClosing(false);
    }, 250);
  };

  const filteredSemesters = generatedSemesters.filter(
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
                <li> <strong>Certified True Copy of Grades</strong> from the University Registrar.
                </li>
                <li> <strong>Certificate of Registration (Form 5)</strong> for the semester.
                </li>
                <li>Files must be clear scanned copies (PDF preferred).
                </li>
                <li>Registrar's official seal and signature must be visible.
                </li>
             </ul>
          </div>
        </CardContent>
      </Card>

      <Select 
        label="Select Academic Year"
        value={selectedAcademicYear}
        onChange={(e) => setSelectedAcademicYear(e.target.value)}
        options={academicYearOptions}
      />

      {/* Semester Grid serves as the "Selection" UI here */}
      <SemesterGrid 
        semesters={filteredSemesters} 
        onSelectSemester={handleOpenModal}
        academicYear={selectedAcademicYear}
      />

      <RecentSubmissions onSelectSubmission={handleOpenModal} />

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