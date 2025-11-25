'use client';

import { useState, useEffect, useCallback } from 'react';
import { PTPRow } from './PTPRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import type { PTPRequestDetails } from '@/types/admin';

interface PTPTableProps {
  searchTerm: string;
}

export function PTPTable({ searchTerm }: PTPTableProps) {
  const [requests, setRequests] = useState<PTPRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: PTPRequestDetails[] = [
        {
          id: '1',
          spas_id: '2021-001',
          type: 'Referral Letter',
          scholarInfo: {
            name: 'Juan Dela Cruz',
            spas_id: '2021-001',
            email: 'juan.delacruz@example.com',
            contactNumber: '09123456789',
            dateOfBirth: '2000-01-01',
            completeAddress: 'Manila',
          },
          placementInfo: {
            scholarshipType: 'RA 7687',
            batch: 2021,
            university: 'University of the Philippines',
            program: 'BS Computer Science',
          },
          submissionInfo: {
            dateSubmitted: new Date().toISOString(),
            status: 'Pending',
            trainingYear: 2024,
            plan: 'undertake_ptp',
            semester: 'Midyear', // FIXED: Changed from 'Mid-Year Term' to 'Midyear'
            academicYear: '2023-2024'
          },
          files: {
            grades: 'grades.pdf',
            replySlip: 'reply_slip.pdf',
            curriculum: 'curriculum.pdf',
          },
        },
        {
          id: '2',
          spas_id: '2021-002',
          type: 'Program Completion',
          scholarInfo: {
            name: 'Maria Clara',
            spas_id: '2021-002',
            email: 'maria.clara@example.com',
            contactNumber: '09987654321',
            dateOfBirth: '2001-05-05',
            completeAddress: 'Quezon City',
          },
          placementInfo: {
            scholarshipType: 'Merit',
            batch: 2021,
            university: 'Ateneo de Manila University',
            program: 'BS Physics',
          },
          submissionInfo: {
            dateSubmitted: new Date(Date.now() - 86400000).toISOString(),
            status: 'Approved',
            trainingYear: 2024,
            semester: 'Midyear', // FIXED: Changed from 'Mid-Year Term' to 'Midyear'
            academicYear: '2023-2024'
          },
          files: {
            form126: 'f126.pdf',
            form127: 'f127.pdf',
            form128: 'f128.pdf',
            dtr: 'dtr_signed.pdf',
            certCompletion: 'certificate.pdf',
          },
        },
      ];

      setRequests(mockData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch requests.');
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Term</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University / Program</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((req) => (
              <PTPRow 
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