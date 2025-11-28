'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReimbursementRow } from './ReimbursementRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import { toast } from '@/components/ui/toaster';
import type { SubmissionStatus } from '@/types/services';

// Extended interface for Admin View
export interface ReimbursementRequestDetails {
  id: string;
  spas_id: string;
  reimbursementType: 'Tuition Fee' | 'Transportation Allowance' | 'Review Fee' | 'Others';
  amount: number;
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
  submissionInfo: {
    dateSubmitted: string;
    status: SubmissionStatus;
    reason: string; // Maps to "Particulars / Details" from Scholar Form
    adminComment?: string;
  };
  files: {
    officialReceipt: string; // Maps to the single "receipt" file from Scholar Form
  };
}

interface ReimbursementTableProps {
  searchTerm: string;
}

export function ReimbursementTable({ searchTerm }: ReimbursementTableProps) {
  const [requests, setRequests] = useState<ReimbursementRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: ReimbursementRequestDetails[] = [
        // 1. Tuition Fee Reimbursement
        {
          id: '1',
          spas_id: '2023-00123',
          reimbursementType: 'Tuition Fee',
          amount: 25000.00,
          scholarInfo: {
            name: 'Juan Dela Cruz',
            spas_id: '2023-00123',
            email: 'juan.delacruz@ust.edu.ph',
            contactNumber: '09170001234',
          },
          currentPlacement: {
            scholarshipType: 'Merit',
            batch: 2023,
            university: 'University of Santo Tomas',
            program: 'BS Biochemistry',
          },
          submissionInfo: {
            dateSubmitted: new Date().toISOString(),
            status: 'Pending',
            reason: 'Tuition fee for 1st Sem AY 2024-2025',
          },
          files: {
            officialReceipt: 'assessment_form_ust.pdf',
          },
        },

        // 2. Transportation Allowance
        {
          id: '2',
          spas_id: '2022-05501',
          reimbursementType: 'Transportation Allowance',
          amount: 4500.00,
          scholarInfo: {
            name: 'Maria Clara',
            spas_id: '2022-05501',
            email: 'maria.clara@example.com',
            contactNumber: '09171234567',
          },
          currentPlacement: {
            scholarshipType: 'RA 7687',
            batch: 2022,
            university: 'Ateneo de Manila University',
            program: 'BS Physics',
          },
          submissionInfo: {
            dateSubmitted: '2024-05-20T10:00:00Z',
            status: 'Resubmit',
            reason: 'Round trip bus fare Manila to Cebu for semester break.',
            adminComment: 'Please upload the original Boarding Pass, not just the booking confirmation.',
          },
          files: {
            officialReceipt: 'booking_confirmation.pdf',
          },
        },

        // 3. Review Fee
        {
          id: '3',
          spas_id: '2020-09999',
          reimbursementType: 'Review Fee',
          amount: 15000.00,
          scholarInfo: {
            name: 'Crisostomo Ibarra',
            spas_id: '2020-09999',
            email: 'crisostomo@up.edu.ph',
            contactNumber: '09181234567',
          },
          currentPlacement: {
            scholarshipType: 'Merit',
            batch: 2020,
            university: 'UP Diliman',
            program: 'BS Civil Engineering',
          },
          submissionInfo: {
            dateSubmitted: '2024-06-01T08:30:00Z',
            status: 'Approved',
            reason: 'Enrollment in Review Center for CE Board Exam.',
          },
          files: {
            officialReceipt: 'review_center_receipt.pdf',
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
    r.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.spas_id.includes(searchTerm)
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((req) => (
              <ReimbursementRow 
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