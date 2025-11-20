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
import { useCurrentScholarGrade, iGradeSubmissions } from '@/hooks/scholar/useCurrentScholarGrade';

const requirements = [
  'Certified True Copy of complete grades and certificate of registration from University Registrar',
  'Clear scanned copy or high-quality photo',
  'All subjects and grades clearly visible',
  'Registrar\'s official seal and signature present',
];

const jlssScholarships = [ "JLSS, RA 7687", "JLSS, Merit", "JLSS, RA 10612", ];


function GetAcademicYearOptions(batch: number, scholarshipType: string, courseDuration: number) 
{  
  const scholarshipDuration = jlssScholarships.includes(scholarshipType)? 
                            (courseDuration == 4? 2 : 3) : (courseDuration);

  const academicYearOptions = Array.from({ length: scholarshipDuration }, (_, i) => {
    const label = `AY ${batch + scholarshipDuration - i - 1}-${batch + scholarshipDuration - i}`;
    return { value: label, label, year: courseDuration--};
  });

  return academicYearOptions;
}


function GetGradeRecordBySemester(midyearClasses: number[],
      academicYearOptions: {label: string, value: string, year: number}[],
      grade?: iGradeSubmissions[] | null)
{
  academicYearOptions.reverse();

  const nextYear = new Date().getFullYear() + 1;
  const semesters: Semester[] = ['1st Semester', '2nd Semester', 'Midyear'];

  const gradeRecords: SemesterAvailability[] = academicYearOptions.flatMap(option => {
    const semCount = midyearClasses.includes(option.year) ? 3 : 2;
    let year = Number(option.label.slice(-4));

    return semesters.slice(0, semCount).map(semester => {
      const entry = grade?.find(i => i.semester === semester && i.year_level === option.year);
      // Uncomment if past semester should be closed when grade file is null.
      // const status = entry?.status ?? (nextYear < year? 'Not Available' : (nextYear > year)? 'Closed' : 'Resubmit')
      const status = entry?.status ?? (nextYear < year? 'Not Available' : 'Resubmit');

      return {
        academicYear: option.label,
        isAvailable: grade?.some(i => i.semester === semester && i.year_level === option.year) ?? false,
        isCurrent: (nextYear === year),
        isFuture: (nextYear < year),
        isPast: (nextYear > year),
        semester,
        status: (status) as SubmissionStatus,
        year: option.year,
        gradeFileKey: entry?.grade_file_key ?? null,
        corFileKey: entry?.cor_file_key ?? null
    }});
  });

  return gradeRecords;
}

export function GradeSubmissionPanel() {
  const [selectedSemester, setSelectedSemester] = useState<SemesterAvailability | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  
  const user = JSON.parse(sessionStorage.getItem("user") ?? '');

  const acadYearOptions = GetAcademicYearOptions(Number(user.batch), user.scholarship_type, user.course_duration);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(acadYearOptions[0]['label']); 

  const { grade, loading, error } = useCurrentScholarGrade();
  const gradeRecord = GetGradeRecordBySemester([...user.midyear_classes], [...acadYearOptions], grade);
  
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
        options={acadYearOptions}
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
        />
      )}
    </div>
  );
}