'use client';

import { GradeSubmissionRow } from './GradeSubmissionRow';
import { Pagination } from '@/components/shared/Pagination';
import type { SubmissionStatus, YearLevel, Semester, ScholarshipType } from '@/types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export interface GradeSubmissionDetails {
  id: string;
  scholarInfo: {
    name: string;
    contactNumber: string;
    dateOfBirth: string;
    completeAddress: string;
  };
  placementInfo: {
    scholarshipType: ScholarshipType;
    batch: number;
    university: string;
    program: string;
  };
  submissionInfo: {
    year: YearLevel;
    semester: Semester;
    academicYear: string;
    dateSubmitted: string;
    status: SubmissionStatus;
    adminComment?: string;
  };
  files: {
    registrationForm: string;
    copyOfGrades: string;
    curriculumFile: string; // <-- ADDED BACK
  };
  scholarStatus: 'Active' | 'Warning' | '2nd Warning' | 'Suspended';
}

const mockSubmissions: GradeSubmissionDetails[] = [
  {
    id: '2', 
    scholarInfo: {
      name: 'Aldrich Amiel Arenas',
      contactNumber: '+639203430975',
      dateOfBirth: '09/06/2004',
      completeAddress: 'Balayan, Batangas',
    },
    placementInfo: {
      scholarshipType: 'RA 7687',
      batch: 2022,
      university: 'Batangas State University - Main 2',
      program: 'BS Computer Science',
    },
    submissionInfo: {
      year: '3rd Year',
      semester: '2nd Semester',
      academicYear: 'AY 2024 - 2025',
      dateSubmitted: '2025-02-08',
      status: 'Pending',
      adminComment: undefined,
    },
    files: {
      registrationForm: 'Arenas_COR.pdf',
      copyOfGrades: 'Arenas_CopyOfGrades.pdf',
      curriculumFile: 'Arenas_Curriculum.pdf', // <-- ADDED BACK
    },
    scholarStatus: 'Active',
  },
  {
    id: '1', 
    scholarInfo: {
      name: 'Joshua De Larosa',
      contactNumber: '+639123456789',
      dateOfBirth: '01/01/2003',
      completeAddress: 'San Pablo, Laguna',
    },
    placementInfo: {
      scholarshipType: 'Merit',
      batch: 2021,
      university: 'Laguna State Polytechnic University',
      program: 'BS Electronics Engineering',
    },
    submissionInfo: {
      year: '4th Year',
      semester: '2nd Semester',
      academicYear: '2024 - 2025',
      dateSubmitted: '2025-02-07',
      status: 'Resubmit',
      adminComment: 'Invalid Certificate of Registration. Please upload the certified true copy of the document from the university registrar.',
    },
    files: {
      registrationForm: 'DeLarosa_COR_v1.pdf',
      copyOfGrades: 'DeLarosa_Grades_v1.pdf',
      curriculumFile: 'DeLarosa_Curriculum.pdf', // <-- ADDED BACK
    },
    scholarStatus: 'Active',
  },
  // ... other mock data ...
];

interface GradeSubmissionsTableProps {
  searchTerm: string;
}

export function GradeSubmissionsTable({ searchTerm }: GradeSubmissionsTableProps) {
  const filteredSubmissions = mockSubmissions.filter((s) =>
    s.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* ... table headers ... */}
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Details</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubmissions.map((submission) => (
              <GradeSubmissionRow key={submission.id} submission={submission} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing 1-{filteredSubmissions.length} of {mockSubmissions.length} Grade Submissions
        </p>

        <Pagination
          currentPage={1}
          totalPages={1} 
          onPageChange={() => {}}
          className="sm:justify-self-center" 
        />

        <div className="flex sm:justify-end">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
        
      </div>
    </>
  );
}