'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShiftingTransferringRow } from './ShiftingTransferringRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import { toast } from '@/components/ui/toaster';
import type { SubmissionStatus, ShiftingType } from '@/types/services';

export interface ShiftingRequestDetails {
  id: string;
  spas_id: string;
  applicationType: ShiftingType;
  scholarInfo: {
    name: string;
    spas_id: string;
    email: string;
    contactNumber: string;
    completeAddress: string;
  };
  currentPlacement: {
    scholarshipType: string;
    batch: number;
    university: string;
    program: string;
  };
  newPlacement: {
    university?: string; // For transferring
    program?: string;    // For shifting
    effectivity: string;
    duration: string;
  };
  submissionInfo: {
    dateSubmitted: string;
    status: SubmissionStatus;
    reason: string;
    adminComment?: string;
    delayReason?: string; // Added for late submissions
  };
  files: {
    applicationForm: string;
    certificationAdmission: string;
    certificationAccredited: string;
    certificationYearLevel: string;
    certificationGrades: string;
    approvedProgram: string;
  };
}

interface ShiftingTransferringTableProps {
  searchTerm: string;
}

export function ShiftingTransferringTable({ searchTerm }: ShiftingTransferringTableProps) {
  const [requests, setRequests] = useState<ShiftingRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: ShiftingRequestDetails[] = [
        // 1. SHIFTING COURSE ONLY
        {
          id: '1',
          spas_id: '2021-00123',
          applicationType: 'Shifting Course',
          scholarInfo: {
            name: 'Juan Dela Cruz',
            spas_id: '2021-00123',
            email: 'juan.delacruz@up.edu.ph',
            contactNumber: '09170001234',
            completeAddress: 'Quezon City',
          },
          currentPlacement: {
            scholarshipType: 'RA 7687',
            batch: 2021,
            university: 'UP Diliman',
            program: 'BS Physics',
          },
          newPlacement: {
            program: 'BS Mathematics', // Only program changes
            effectivity: '1st Semester, AY 2024-2025',
            duration: '4 Years'
          },
          submissionInfo: {
            dateSubmitted: new Date().toISOString(),
            status: 'Pending',
            reason: 'I realized my strengths lie more in pure mathematics than physics.',
          },
          files: {
            applicationForm: 'shifting_form_juan.pdf',
            certificationAdmission: 'math_dept_acceptance.pdf',
            certificationAccredited: 'accredited_sub.pdf',
            certificationYearLevel: 'year_level.pdf',
            certificationGrades: 'grades_physics.pdf',
            approvedProgram: 'math_curriculum.pdf',
          },
        },

        // 2. TRANSFERRING SCHOOL ONLY (Same Program)
        {
          id: '2',
          spas_id: '2022-05501',
          applicationType: 'Transferring School',
          scholarInfo: {
            name: 'Maria Clara',
            spas_id: '2022-05501',
            email: 'maria.clara@example.com',
            contactNumber: '09171234567',
            completeAddress: 'Laguna',
          },
          currentPlacement: {
            scholarshipType: 'Merit',
            batch: 2022,
            university: 'Ateneo de Manila University',
            program: 'BS Biology',
          },
          newPlacement: {
            university: 'De La Salle University', // Only university changes
            effectivity: '1st Semester, AY 2024-2025',
            duration: '3 Years'
          },
          submissionInfo: {
            dateSubmitted: '2024-05-20T10:00:00Z',
            status: 'Approved',
            reason: 'My family is relocating to Manila near DLSU, making it more accessible.',
          },
          files: {
            applicationForm: 'transfer_form.pdf',
            certificationAdmission: 'dlsu_admit.pdf',
            certificationAccredited: 'credit_eval.pdf',
            certificationYearLevel: 'standing.pdf',
            certificationGrades: 'grades_ateneo.pdf',
            approvedProgram: 'bio_curr_dlsu.pdf',
          },
        },

        // 3. SHIFTING AND TRANSFERRING (Both Change)
        {
          id: '3',
          spas_id: '2023-99887',
          applicationType: 'Shifting Course & Transferring School',
          scholarInfo: {
            name: 'Jose Rizal Jr.',
            spas_id: '2023-99887',
            email: 'jose.rizal@ust.edu.ph',
            contactNumber: '09981112222',
            completeAddress: 'Manila',
          },
          currentPlacement: {
            scholarshipType: 'RA 7687',
            batch: 2023,
            university: 'University of Santo Tomas',
            program: 'BS Civil Engineering',
          },
          newPlacement: {
            university: 'Mapúa University',
            program: 'BS Architecture',
            effectivity: '1st Quarter, AY 2024-2025',
            duration: '5 Years'
          },
          submissionInfo: {
            dateSubmitted: '2024-06-15T14:30:00Z',
            status: 'Resubmit',
            reason: 'I want to pursue Architecture which aligns better with my career goals.',
            adminComment: 'Please upload the official evaluation of credited subjects from Mapúa.',
          },
          files: {
            applicationForm: 'shift_transfer_app.pdf',
            certificationAdmission: 'mapua_admission.pdf',
            certificationAccredited: 'eval_pending.pdf',
            certificationYearLevel: 'yl_cert.pdf',
            certificationGrades: 'ust_grades.pdf',
            approvedProgram: 'ar_curr.pdf',
          },
        },

        // 4. LATE SUBMISSION EXAMPLE
        {
          id: '4',
          spas_id: '2021-44556',
          applicationType: 'Shifting Course',
          scholarInfo: {
            name: 'Andres Bonifacio',
            spas_id: '2021-44556',
            email: 'andres.b@pup.edu.ph',
            contactNumber: '09223334444',
            completeAddress: 'Tondo, Manila',
          },
          currentPlacement: {
            scholarshipType: 'RA 10612',
            batch: 2021,
            university: 'Polytechnic University of the Philippines',
            program: 'BS Applied Mathematics',
          },
          newPlacement: {
            program: 'BS Statistics',
            effectivity: '2nd Semester, AY 2024-2025',
            duration: '2 Years'
          },
          submissionInfo: {
            dateSubmitted: new Date().toISOString(),
            status: 'Pending',
            reason: 'Shift in career focus towards Data Science.',
            delayReason: 'Release of grades from the previous semester was delayed by the registrar.',
          },
          files: {
            applicationForm: 'app_form_andres.pdf',
            certificationAdmission: 'stat_admission.pdf',
            certificationAccredited: 'accredited.pdf',
            certificationYearLevel: 'year_level.pdf',
            certificationGrades: 'grades_delayed.pdf',
            approvedProgram: 'stat_curr.pdf',
          },
        },
      ];

      setRequests(mockData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch requests.');
      // FIXED: Used toast.error instead of object syntax to match sonner implementation
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Placement</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Changes</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((req) => (
              <ShiftingTransferringRow 
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