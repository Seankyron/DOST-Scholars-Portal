'use client';

import { useState, useEffect, useCallback } from 'react';
import { LeaveOfAbsenceRow } from './LeaveOfAbsenceRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import { toast } from '@/components/ui/toaster';
import type { SubmissionStatus, LOAReason } from '@/types/services';

export interface LOARequestDetails {
  id: string;
  spas_id: string;
  applicationType: LOAReason;
  scholarInfo: {
    name: string;
    spas_id: string;
    email: string;
    contactNumber: string;
  };
  currentPlacement: {
    scholarshipType: string;
    batch: number;
    university: string;
    program: string;
  };
  // Adapted to store LOA specific details
  loaDetails: {
    startSemester: string;
    academicYear: string;
    duration: string;
  };
  submissionInfo: {
    dateSubmitted: string;
    status: SubmissionStatus;
    reason: string; // The specific explanation text
    adminComment?: string;
  };
  files: {
    applicationForm: string;
    certificationGrades: string;
    // specific to Medical/Personal
    universityApproval?: string;
    medicalCertificate?: string;
    // specific to Exchange
    registrationForm?: string;
    proofOfAdmission?: string;
    supportingDocument?: string;
  };
}

interface LeaveOfAbsenceTableProps {
  searchTerm: string;
}

export function LeaveOfAbsenceTable({ searchTerm }: LeaveOfAbsenceTableProps) {
  const [requests, setRequests] = useState<LOARequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        view: 'loa_view',
        orderBy: 'status',
        ascending: 'false',
      });

      const response = await fetch(`/api/admin/get_view?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const res = await response.json();
      const rows = res.data || [];

      const formatted: LOARequestDetails[] = rows.map((e: any) => ({
        id: e.id.toString(),
        spas_id: e.spas_id,
        applicationType: e.type as LOAReason,
        scholarInfo: {
          name: e.full_name,
          spas_id: e.spas_id,
          email: e.email,
          contactNumber: e.contact_number,
        },
        currentPlacement: {
          scholarshipType: e.scholarship_type,
          batch: Number(e.year_awarded),
          university: e.university,
          program: e.program_course,
        },
        loaDetails: {
          startSemester: e.semester,
          academicYear: e.academic_year,
          duration: e.duration,
        },
        submissionInfo: {
          dateSubmitted: e.created_at,
          status: e.status as SubmissionStatus,
          reason: e.reason,
          adminComment: e.comment || '',
        },
        files: {
          applicationForm: e.LOA_form_file_key,
          certificationGrades: e.required_document_file_key?.Grades,
          universityApproval: e.required_document_file_key?.['University Approval'] || undefined,
          medicalCertificate: e.required_document_file_key?.['Medical Certificate'] || undefined,
          registrationForm: e.required_document_file_key?.['Registration Form'] || undefined,
          proofOfAdmission: e.required_document_file_key?.['Proof of Admission'] || undefined,
          supportingDocument: e.required_document_file_key?.['Other Documents'] || undefined,
        },
      }));

      setRequests(formatted);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch LOA requests.');
      toast.error('Error', { description: 'Failed to load LOA requests.' });
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-dost-title" />
      </div>
    );
  }

  if (error) return <p className="p-4 text-red-500 text-center">{error}</p>;

  const filteredRequests = requests.filter((r) =>
    r.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOA Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Placement</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Period</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((req) => (
              <LeaveOfAbsenceRow 
                key={req.id} 
                request={req} 
                onUpdate={fetchData}
              />
            ))}
          </tbody>
        </table>
        
        {filteredRequests.length === 0 && (
           <p className="text-sm text-gray-500 text-center py-8">No requests found.</p>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 border-t">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing {filteredRequests.length} of {requests.length} Requests
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