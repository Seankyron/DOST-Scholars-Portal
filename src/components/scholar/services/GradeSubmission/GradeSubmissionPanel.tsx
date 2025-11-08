'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { SemesterGrid } from './SemesterGrid';
import { RecentSubmissions } from './RecentSubmissions';
import { GradeSubmissionModal } from './GradeSubmissionModal';
import type { SemesterAvailability } from '@/types/curriculum';
import type { SubmissionStatus } from '@/types/services'; // <-- Import SubmissionStatus

// Mock data based on PDF Page 11
const mockSemesterAvailability: SemesterAvailability[] = [
  // 1st Year
  { year: 1, semester: '1st Semester', isAvailable: false, isCurrent: false, isPast: true, isFuture: false, status: 'Approved' as SubmissionStatus },
  { year: 1, semester: '2nd Semester', isAvailable: false, isCurrent: false, isPast: true, isFuture: false, status: 'Approved' as SubmissionStatus },
  
  // 2nd Year
  { year: 2, semester: '1st Semester', isAvailable: false, isCurrent: false, isPast: true, isFuture: false, status: 'Approved' as SubmissionStatus },
  { year: 2, semester: '2nd Semester', isAvailable: false, isCurrent: false, isPast: true, isFuture: false, status: 'Pending' as SubmissionStatus },

  // 3rd Year
  { year: 3, semester: '1st Semester', isAvailable: false, isCurrent: false, isPast: true, isFuture: false, status: 'Approved' as SubmissionStatus },
  { year: 3, semester: '2nd Semester', isAvailable: false, isCurrent: true, isPast: false, isFuture: false, status: 'Resubmit' as SubmissionStatus },
  
  // 4th Year
  { year: 4, semester: '1st Semester', isAvailable: true, isCurrent: false, isFuture: true, isPast: false, status: 'Open' as SubmissionStatus },
  { year: 4, semester: '2nd Semester', isAvailable: false, isCurrent: false, isFuture: true, isPast: false, status: 'Not Available' as SubmissionStatus },
];
// (I also added isFuture/isPast to fully match the interface)

const requirements = [
  'Certified True Copy of complete grades and certificate of registration from University Registrar',
  'Clear scanned copy or high-quality photo',
  'All subjects and grades clearly visible',
  'Registrar\'s official seal and signature present',
];

export function GradeSubmissionPanel() {
  const [selectedSemester, setSelectedSemester] = useState<SemesterAvailability | null>(null);

  const handleOpenModal = (semester: SemesterAvailability) => {
    if (semester.status === 'Open' || semester.status === 'Resubmit' || semester.status === 'Pending') {
      setSelectedSemester(semester);
    }
  };

  const handleCloseModal = () => {
    setSelectedSemester(null);
    // Here you would refetch the semester availability data
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-dost-title">Grade Submission</h2>
      
      {/* Requirements Card - PDF Page 11 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-dost-blue">Grade Submission Requirements</CardTitle>
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

      {/* Semester Grid */}
      <SemesterGrid 
        semesters={mockSemesterAvailability}
        onSelectSemester={handleOpenModal} 
      />

      {/* Recent Submissions - PDF Page 15 */}
      <RecentSubmissions />

      {/* Submission Modal */}
      {selectedSemester && (
        <GradeSubmissionModal
          isOpen={!!selectedSemester}
          onClose={handleCloseModal}
          semester={selectedSemester}
        />
      )}
    </div>
  );
}