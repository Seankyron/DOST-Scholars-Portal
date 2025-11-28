'use client';

import { useState, useEffect, useCallback } from 'react';
import { PTPRow } from './PTPRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PTPRequestDetails } from '@/types/admin';
import { toast } from '@/components/ui/toaster';

interface PTPTableProps {
  searchTerm: string;
}

export function PTPTable({ searchTerm }: PTPTableProps) {
  const [requests, setRequests] = useState<PTPRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/ptp/get');
      if (!response.ok) throw new Error('Failed to fetch data');

      const res = await response.json();

      // Mapping database fields to the PTPRequestDetails interface
      const data: PTPRequestDetails[] = res.submissions.map((item: any) => ({
        id: item.ptp_id?.toString() ?? '',
        spas_id: item.spas_id ?? '',
        type: item.ptp_type ?? 'Practical Training',
        
        scholarInfo: {
          name: item.full_name ?? 'Unknown',
          spas_id: item.spas_id ?? '',
          email: item.email ?? '',
          contactNumber: item.contact_number ?? '',
          completeAddress: item.address ?? '',
        },

        placementInfo: {
          scholarshipType: item.scholarship_type ?? '',
          batch: item.year_awarded ? Number(item.year_awarded) : 0,
          university: item.university ?? '',
          program: item.program_course ?? '',
        },

        submissionInfo: {
          dateSubmitted: item.ptp_created_at ?? new Date().toISOString(),
          status: item.ptp_status ?? 'Pending',
          trainingYear: "N/A", 
          plan: item.ptp_plan ?? undefined,
          semester: "N/A",
          academicYear: "N/A",
          adminComment: item.comment || item.ptp_comment || item.admin_comment || item.remarks || '', 
        },

        files: {
          grades: item.grade_file_key ?? '',
          replySlip: item.reply_slip_file_key ?? '',
          curriculum: item.curriculum_file_key ?? '', 
          form126: item.form_126_file_key ?? '',
          form127: item.form_127_file_key ?? '',
          form128: item.form_128_file_key ?? '',
          dtr: item.dtr_file_key ?? '',
          certCompletion: item.training_completion_file_key ?? '',
        },
      }));

      setRequests(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch requests.');
      toast.error("Error", {
        description: "Failed to load PTP requests.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRequests = requests.filter((r) =>
    r.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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