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
          const response = await fetch('/api/admin/ptp/get');
          if (!response.ok) throw new Error('Failed to fetch data');

          const res = await response.json();

          const data: PTPRequestDetails[] = res.submissions.map((item: any) => ({
            id: item.ptp_id?.toString() ?? '',
            spas_id: item.spas_id ?? '',
            type: item.ptp_type ?? '',
            
            scholarInfo: {
              name: item.full_name ?? '',
              spas_id: item.spas_id ?? '',
              email: item.email ?? '',
              contactNumber: item.contact_number ?? '',
              completeAddress: item.address ?? '',
            },

            placementInfo: {
              scholarshipType: item.scholarship_type ?? '',
              batch: item.year_awarded ? Number(item.year_awarded) : null,
              university: item.university ?? '',
              program: item.program_course ?? '',
            },

            submissionInfo: {
              dateSubmitted: item.ptp_created_at ?? '',
              status: item.ptp_status ?? '',
              trainingYear: "Wala sa database, don't know where to add",
              plan: item.ptp_plan ?? '',
              semester: "Wala sa database, don't know where to add",
              academicYear: "Wala sa database, don't know where to add",
            },

            files: {
              grades: item.grade_file_key ?? '',
              replySlip: item.reply_slip_file_key ?? '',
              curriculum: "Wala sa database, don't know where to add",
              form126: item.form_126_file_key ?? '',
              form127: item.form_127_file_key ?? '',
              form128: item.form_128_file_key ?? '',
              dtr: item.dtr_file_key ?? '',
              trainingCompletion: item.training_completion_file_key ?? '',
            },
          }));

          setRequests(data);
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