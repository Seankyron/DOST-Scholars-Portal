'use client';

import { GradeSubmissionRow } from './GradeSubmissionRow';
import { Pagination } from '@/components/shared/Pagination';
import type { SubmissionStatus, YearLevel, Semester, ScholarshipType } from '@/types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    curriculumFile: string;
  };
  scholarStatus: 'Active' | 'Warning' | '2nd Warning' | 'Suspended';
}

interface GradeSubmissionsTableProps {
  searchTerm: string;
}

export function GradeSubmissionsTable({ searchTerm }: GradeSubmissionsTableProps) {
  const [submissions, setSubmissions] = useState<GradeSubmissionDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/grades/get');
        const res = await response.json();

        const formatted: GradeSubmissionDetails[] = (res.submissions || []).map((e: any) => ({
          id: e.submission_id.toString(),
          scholarInfo: {
            name: e.scholar_name,
            contactNumber: e.contact_number,
            dateOfBirth: e.date_of_birth,
            completeAddress: e.complete_address,
          },
          placementInfo: {
            scholarshipType: e.scholarship_type as ScholarshipType,
            batch: Number(e.batch),
            university: e.university,
            program: e.program,
          },
          submissionInfo: {
            year: `${e.year_level}th Year` as YearLevel,
            semester: e.semester as Semester,
            academicYear: e.academic_year,
            dateSubmitted: e.updated_at, 
            status: e.submission_status as SubmissionStatus,
            adminComment: undefined,
          },
          files: {
            registrationForm: e.cor_file_key,
            copyOfGrades: e.grade_file_key,
            curriculumFile: e.curriculum_file_key, 
          },
          scholarStatus: e.scholar_status === 'pending' ? 'Active' : (e.scholar_status as any),
        }));
        setSubmissions(formatted);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const filteredSubmissions = submissions.filter((s) =>
    s.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
          Showing 1-{filteredSubmissions.length} of {submissions.length} Grade Submissions
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
