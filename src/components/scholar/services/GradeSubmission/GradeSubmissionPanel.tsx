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

const requirements = [
  'Certified True Copy of complete grades and certificate of registration from University Registrar',
  'Clear scanned copy or high-quality photo',
  'All subjects and grades clearly visible',
  'Registrar\'s official seal and signature present',
];

const mockCurriculum: CurriculumConfig = {
  midyearYears: [1, 3], 
  thesisYear: 4,
  ojtYear: 3,
  ojtSemester: 'Midyear',
  duration: 4, 
};

const submissionStatuses: Record<string, SubmissionStatus> = {
  '1-1st Semester': 'Approved',
  '1-2nd Semester': 'Approved',
  '1-Midyear': 'Approved', 
  '2-1st Semester': 'Approved',
  '2-2nd Semester': 'Pending', 
  '3-1st Semester': 'Approved',
  '3-2nd Semester': 'Resubmit', 
  '3-Midyear': 'Open', 
  '4-1st Semester': 'Not Available',
  '4-2nd Semester': 'Not Available',
};

const generatedSemesters: SemesterAvailability[] = [];
const courseDuration = mockCurriculum.duration; 

for (let year = 1; year <= courseDuration; year++) {
  const semesters: Semester[] = ['1st Semester', '2nd Semester'];
  
  if (hasMidyear(mockCurriculum, year)) {
    semesters.push('Midyear');
  }

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
    });
  }
}

export function GradeSubmissionPanel() {
  const [selectedSemester, setSelectedSemester] = useState<SemesterAvailability | null>(null);
  const [isClosing, setIsClosing] = useState(false);

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
  return (
    <div className="space-y-6">
      <h2 className="text-3xl text-center font-bold text-dost-title mb-4">
        Grade Submission
      </h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-dost-title">Grade Submission Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <SemesterGrid 
        semesters={generatedSemesters} 
        onSelectSemester={handleOpenModal} 
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