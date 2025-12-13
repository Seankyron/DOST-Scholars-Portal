'use client';

import { useState, useEffect, useCallback } from 'react';
import { GradeSubmissionRow } from './GradeSubmissionRow';
import { Pagination } from '@/components/shared/Pagination';
import type { SubmissionStatus, YearLevel, Semester, ScholarshipType } from '@/types';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/toaster';
import Export from '@/components/shared/Export'; // Assuming you want the export button here too

export interface GradeSubmissionDetails {
  id: number;
  spas_id: string;
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

const ITEMS_PER_PAGE = 7;

export function GradeSubmissionsTable({ searchTerm }: GradeSubmissionsTableProps) {
  const [submissions, setSubmissions] = useState<GradeSubmissionDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        view: 'GradeSubmissionView',
        orderBy: 'submission_status',
        ascending: 'false',
      });

      const response = await fetch(`/api/admin/get_view?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const res = await response.json();
      const rows = res.data || [];

      const formatted: GradeSubmissionDetails[] = rows.map((e: any) => ({
        id: e.submission_id,
        spas_id: e.spas_id,
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
          adminComment: e.comment || '',
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
      toast.error('Error', {
        description: 'Failed to load grade submissions.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredSubmissions = submissions.filter((s) =>
    s.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredSubmissions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-dost-title" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={fetchData}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Term</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University / Program</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((submission) => (
              <GradeSubmissionRow 
                key={submission.id} 
                submission={submission} 
                onUpdate={fetchData}
              />
            ))}
          </tbody>
        </table>

        {filteredSubmissions.length === 0 && (
           <p className="text-sm text-gray-500 text-center py-8">No submissions found.</p>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 border-t">
        {/* FIX: Use currentData.length to show visible items, and filteredSubmissions.length for total */}
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing {currentData.length} of {filteredSubmissions.length} Grade Submissions
        </p>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="sm:justify-self-center"
          />
        )}
        {totalPages <= 1 && <div />}

        <div className="flex sm:justify-end gap-2">
          {/* Note: If you have the Export component, you can use it here instead of the button */}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </>
  );
}