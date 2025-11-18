'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
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
      
      <Card className='bg-yellow-50 border-yellow-200'>
        <CardHeader>
          <CardTitle className="font-bold text-yellow-800">Grade Submission Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-yellow-800">{req}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Select 
        label="Select Academic Year"
        value={selectedAcademicYear}
        onChange={(e) => setSelectedAcademicYear(e.target.value)}
        options={acadYearOptions}
      />

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