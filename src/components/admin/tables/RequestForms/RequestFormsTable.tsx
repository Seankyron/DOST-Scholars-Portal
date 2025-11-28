'use client';

import { useState, useEffect, useCallback } from 'react';
import { RequestFormsRow } from './RequestFormsRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import { toast } from '@/components/ui/toaster';
import type { SubmissionStatus, RequestFormType } from '@/types/services';

export interface RequestFormDetails {
  id: string;
  spas_id: string;
  requestType: RequestFormType;
  scholarInfo: {
    name: string;
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
    reason: string; 
    details?: string; 
    adminComment?: string;
  };
  files: {
    supportingDocument?: string; 
  };
}

interface RequestFormsTableProps {
  searchTerm: string;
}

export function RequestFormsTable({ searchTerm }: RequestFormsTableProps) {
  const [requests, setRequests] = useState<RequestFormDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: RequestFormDetails[] = [
        // 1. Pending - Letter of Endorsement (Standard Request)
        {
          id: '1',
          spas_id: '2023-00123',
          requestType: 'Letter of Endorsement',
          scholarInfo: {
            name: 'Juan Dela Cruz',
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
            reason: 'Requirement for OJT Application at DOST-SEI.',
            details: 'Dr. Josette Biyo, Director, DOST-SEI', 
          },
          files: {
            supportingDocument: 'acceptance_letter_draft.pdf',
          },
        },

        // 2. Approved - Certificate of Scholarship (Historical Data)
        {
          id: '2',
          spas_id: '2022-05501',
          requestType: 'Certificate of Scholarship',
          scholarInfo: {
            name: 'Maria Clara',
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
            status: 'Approved',
            reason: 'For opening of Landbank Payroll Account.',
            adminComment: 'Sent via email on May 21, 2024.',
          },
          files: {}, 
        },

        // 3. Resubmit - Certificate of Grades (Problematic File)
        {
          id: '3',
          spas_id: '2020-09999',
          requestType: 'Certificate of Grades',
          scholarInfo: {
            name: 'Crisostomo Ibarra',
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
            status: 'Resubmit',
            reason: 'For scholarship renewal reference.',
            adminComment: 'The attached request letter is blurred. Please upload a clearer copy.',
          },
          files: {
            supportingDocument: 'request_letter_scan_blurred.jpg',
          },
        },

        // 4. Pending - Financial Breakdown (Complex Request)
        {
          id: '4',
          spas_id: '2021-08888',
          requestType: 'Financial Breakdown',
          scholarInfo: {
            name: 'Simoun Ibarra',
            email: 'simoun@dlsu.edu.ph',
            contactNumber: '09191234567',
          },
          currentPlacement: {
            scholarshipType: 'RA 7687',
            batch: 2021,
            university: 'De La Salle University',
            program: 'BS Chemical Engineering',
          },
          submissionInfo: {
            dateSubmitted: '2024-06-15T14:20:00Z',
            status: 'Pending',
            reason: 'Requirement for transferring to another university.',
          },
          files: {
            supportingDocument: 'clearance_form.pdf',
          },
        },

        // 5. Pending - Certificate of Good Moral (Simple Request)
        {
          id: '5',
          spas_id: '2023-01111',
          requestType: 'Certificate of Good Moral',
          scholarInfo: {
            name: 'Basilio Sisa',
            email: 'basilio@pup.edu.ph',
            contactNumber: '09201234567',
          },
          currentPlacement: {
            scholarshipType: 'JLSS',
            batch: 2023,
            university: 'Polytechnic University of the Philippines',
            program: 'BS Biology',
          },
          submissionInfo: {
            dateSubmitted: '2024-06-18T09:00:00Z',
            status: 'Pending',
            reason: 'Requirement for medical school application.',
          },
          files: {},
        }
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
    r.spas_id.includes(searchTerm) ||
    r.requestType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((req) => (
              <RequestFormsRow 
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