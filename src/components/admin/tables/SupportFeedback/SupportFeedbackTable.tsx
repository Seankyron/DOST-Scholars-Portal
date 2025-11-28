'use client';

import { useState, useEffect, useCallback } from 'react';
import { SupportFeedbackRow } from './SupportFeedbackRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import { toast } from '@/components/ui/toaster';
import type { SubmissionStatus } from '@/types/services';

// Interface matching Scholar Data Structure
export interface SupportFeedbackRequestDetails {
  id: string;
  spas_id: string;
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
    category: string;
    description: string; 
    adminResponse?: string; 
  };
  files: {
    attachment?: string; 
  };
}

interface SupportFeedbackTableProps {
  searchTerm: string;
}

export function SupportFeedbackTable({ searchTerm }: SupportFeedbackTableProps) {
  const [requests, setRequests] = useState<SupportFeedbackRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: SupportFeedbackRequestDetails[] = [
        // 1. Technical Issue (Pending)
        {
          id: 'TKT-001',
          spas_id: '2023-00123',
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
            category: 'Technical Issue',
            description: 'I cannot upload my Grade Submission file. It keeps saying "Network Error" even though my internet is fine.',
          },
          files: {
            attachment: 'error_screenshot.png',
          },
        },
        // 2. Inquiry (Info Needed / Resubmit)
        {
          id: 'TKT-002',
          spas_id: '2022-05501',
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
            dateSubmitted: '2024-11-20T10:00:00Z',
            status: 'Resubmit', // Admin requested info
            category: 'Scholarship Inquiry',
            description: 'Can I request for a thesis allowance in advance? I need to buy chemicals next week.',
            adminResponse: 'We need to see your approved thesis proposal first. Please upload it in the Thesis module.',
          },
          files: {},
        },
        // 3. Suggestion (Resolved)
        {
          id: 'TKT-003',
          spas_id: '2021-09999',
          scholarInfo: {
            name: 'Crisostomo Ibarra',
            spas_id: '2021-09999',
            email: 'crisostomo@up.edu.ph',
            contactNumber: '09181234567',
          },
          currentPlacement: {
            scholarshipType: 'Merit',
            batch: 2021,
            university: 'UP Diliman',
            program: 'BS Civil Engineering',
          },
          submissionInfo: {
            dateSubmitted: '2024-11-15T08:30:00Z',
            status: 'Approved', // Mapped to 'Resolved' in Scholar View
            category: 'Suggestion / Feedback',
            description: 'It would be great if we could see a history of our stipend releases in a chart format.',
            adminResponse: 'Thank you for your suggestion! We have noted this for future updates.',
          },
          files: {},
        },
      ];

      setRequests(mockData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tickets.');
      toast.error("Error", { description: "Failed to load support tickets." });
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
    r.submissionInfo.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((req) => (
              <SupportFeedbackRow 
                key={req.id} 
                request={req} 
                onUpdate={fetchData}
              />
            ))}
          </tbody>
        </table>
        
        {filteredRequests.length === 0 && (
           <p className="text-sm text-gray-500 text-center py-8">No tickets found.</p>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 border-t">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing {filteredRequests.length} of {requests.length} Tickets
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