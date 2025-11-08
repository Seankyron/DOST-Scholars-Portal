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

const requirements = [
  'Scanned copy of 𝐓𝐎𝐑 𝐨𝐫 𝐂𝐞𝐫𝐭𝐢𝐟𝐢𝐞𝐝 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞 𝐆𝐫𝐚𝐝𝐞𝐬 (𝐜𝐨𝐧𝐭𝐢𝐧𝐮𝐞𝐬 𝐠𝐫𝐚𝐝𝐞𝐬 𝐟𝐫𝐨𝐦 𝐅𝐢𝐫𝐬𝐭 𝐬𝐞𝐦𝐞𝐬𝐭𝐞𝐫 𝐨𝐟 𝐲𝐨𝐮𝐫 𝟏𝐬𝐭 𝐲𝐞𝐚𝐫 𝐮𝐩 𝐭𝐨 𝐒𝐞𝐜𝐨𝐧𝐝 𝐬𝐞𝐦𝐞𝐬𝐭𝐞𝐫 𝐨𝐫 𝐌𝐢𝐝𝐲𝐞𝐚𝐫 𝐀𝐘 𝟐𝟎𝟐𝟒-𝟐𝟎𝟐𝟓)', 
  'Scanned copy of 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢𝐨𝐧 𝐅𝐨𝐫𝐦 𝐟𝐨𝐫 𝐅𝐢𝐫𝐬𝐭 𝐬𝐞𝐦𝐞𝐬𝐭𝐞𝐫 𝐀𝐘 𝟐𝟎𝟐𝟓-𝟐𝟎𝟐𝟔',
  'and other requirements (if applicable)',
  'Correct and complete details required',
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
const courseDuration = mockCurriculum.duration; // 4 years

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
      isCurrent: false, 
      isPast: false, 
      isFuture: false,
    });
  }
}

export function GradeSubmissionPanel() {
  const [selectedSemester, setSelectedSemester] = useState<SemesterAvailability | null>(null);

  const handleOpenModal = (semester: SemesterAvailability) => {
    if (semester.status !== 'Not Available') {
      setSelectedSemester(semester);
    }
  };

  const handleCloseModal = () => {
    setSelectedSemester(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-dost-title">Grade Submission</h2>
      
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
        semesters={generatedSemesters} 
        onSelectSemester={handleOpenModal} 
      />

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