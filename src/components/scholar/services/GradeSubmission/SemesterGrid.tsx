'use client';

import { SemesterCard } from './SemesterCard';
import type { SemesterAvailability } from '@/types/curriculum';

interface SemesterGridProps {
  semesters: SemesterAvailability[];
  onSelectSemester: (semester: SemesterAvailability) => void;
  academicYear: string;
}

export function SemesterGrid({ 
  semesters, 
  onSelectSemester, 
  academicYear 
}: SemesterGridProps) {
  
  // Group semesters by year
  const semestersByYear = semesters.reduce((acc, sem) => {
    (acc[sem.year] = acc[sem.year] || []).push(sem);
    return acc;
  }, {} as Record<number, SemesterAvailability[]>);


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
          <div className="mb-2">
            <h3 className="text-2xl text-center font-bold text-dost-title">
              {yearLabels[Number(year)]}
            </h3>
            <p className="text-center text-base font-medium text-gray-500">
              {academicYear}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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