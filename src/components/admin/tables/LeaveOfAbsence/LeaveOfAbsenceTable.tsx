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
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: LOARequestDetails[] = [
        // 1. MEDICAL LOA
        {
          id: '1',
          spas_id: '2021-00123',
          applicationType: 'Medical/Personal',
          scholarInfo: {
            name: 'Juan Dela Cruz',
            spas_id: '2021-00123',
            email: 'juan.delacruz@up.edu.ph',
            contactNumber: '09170001234',
          },
          currentPlacement: {
            scholarshipType: 'RA 7687',
            batch: 2021,
            university: 'UP Diliman',
            program: 'BS Physics',
          },
          loaDetails: {
            startSemester: '1st Semester',
            academicYear: '2024-2025',
            duration: '1 Year',
          },
          submissionInfo: {
            dateSubmitted: new Date().toISOString(),
            status: 'Pending',
            reason: 'I need to undergo surgery and recovery for 6 months.',
          },
          files: {
            applicationForm: 'loa_form_juan.pdf',
            certificationGrades: 'grades_summary.pdf',
            universityApproval: 'univ_clearance.pdf',
            medicalCertificate: 'med_cert_hospital.pdf',
          },
        },

        // 2. EXCHANGE STUDENT LOA
        {
          id: '2',
          spas_id: '2022-05501',
          applicationType: 'Exchange Student Program',
          scholarInfo: {
            name: 'Maria Clara',
            spas_id: '2022-05501',
            email: 'maria.clara@example.com',
            contactNumber: '09171234567',
          },
          currentPlacement: {
            scholarshipType: 'Merit',
            batch: 2022,
            university: 'Ateneo de Manila University',
            program: 'BS Biology',
          },
          loaDetails: {
            startSemester: '2nd Semester',
            academicYear: '2024-2025',
            duration: '1 Semester',
          },
          submissionInfo: {
            dateSubmitted: '2024-05-20T10:00:00Z',
            status: 'Resubmit',
            reason: 'Accepted into the exchange program at National University of Singapore.',
            adminComment: 'Please upload a clearer copy of your Proof of Admission.',
          },
          files: {
            applicationForm: 'loa_exchange_maria.pdf',
            certificationGrades: 'grades_ateneo.pdf',
            registrationForm: 'form5_exchange.pdf',
            proofOfAdmission: 'nus_acceptance_blur.pdf',
          },
        },
      ];

      setRequests(mockData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch requests.');
      toast.error("Error", {
         description: "Failed to load requests."
      });
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