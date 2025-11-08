'use client';

import { SemesterCard } from './SemesterCard';
import type { SemesterAvailability } from '@/types/curriculum';
import { getAcademicYear } from '@/lib/utils/date'; // Assuming you have this util

interface SemesterGridProps {
  semesters: SemesterAvailability[];
  onSelectSemester: (semester: SemesterAvailability) => void;
}

export function SemesterGrid({ semesters, onSelectSemester }: SemesterGridProps) {
  
  // Group semesters by year
  const semestersByYear = semesters.reduce((acc, sem) => {
    (acc[sem.year] = acc[sem.year] || []).push(sem);
    return acc;
  }, {} as Record<number, SemesterAvailability[]>);

  // Mock academic year for display - you'd likely get this from data
  const mockAcademicYear = '2023-2024';

  const yearLabels: { [key: number]: string } = {
    1: 'First Year',
    2: 'Second Year',
    3: 'Third Year',
    4: 'Fourth Year',
    5: 'Fifth Year',
  };

  return (
    <div className="space-y-6">
      {Object.entries(semestersByYear).map(([year, sems]) => (
        <div key={year}>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {/* Based on PDF Page 11, e.g., "Fourth Year (2023-2024)" */}
            {yearLabels[Number(year)]} ({mockAcademicYear})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sems.map((sem) => (
              <SemesterCard 
                key={sem.semester}
                semester={sem}
                onSelect={() => onSelectSemester(sem)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}