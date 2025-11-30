'use client';

import { useState, useEffect, useCallback } from 'react';
import { PTPRow } from './PTPRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import type { PTPRequestDetails } from '@/types/admin';

interface PTPTableProps {
  searchTerm: string;
  filterType: 'Referral Letter' | 'Program Completion';
}

export function PTPTable({ searchTerm, filterType }: PTPTableProps) {
  const [requests, setRequests] = useState<PTPRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        view: 'ptp_view',
        orderBy: 'ptp_status',
        ascending: 'false',
      });
      const response = await fetch(`/api/admin/get_view?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const res = await response.json();
      
      // 1. Map the API response correctly without the hardcoded mock data artifacts
      const allRequests: PTPRequestDetails[] = res.data.map((item: any) => ({
        id: item.ptp_id?.toString() ?? '',
        spas_id: item.spas_id ?? '',
        type: item.ptp_type ?? 'Practical Training', // Ensure this matches 'Referral Letter' or 'Program Completion' in your DB
        
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
          trainingYear: "N/A", // Map this if available in API
          plan: item.ptp_plan ?? undefined,
          semester: "N/A", // Map this if available in API
          academicYear: "N/A", // Map this if available in API
          adminComment: item.comment || item.ptp_comment || item.admin_comment || item.remarks || '', 
        },
        
        // Initialize files object (map specific fields from item if your API returns them)
        files: {
            // Example: form126: item.file_form126 ?? undefined
        }
      }));

      // 2. Filter the mapped data based on the prop
      const filtered = allRequests.filter(item => item.type === filterType);
      setRequests(filtered);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch requests.');
    } finally {
      setLoading(false);
    }
  }, [filterType]);

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
              
              {/* Only show Plan column for Referral Letters */}
              {filterType === 'Referral Letter' && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selected Plan</th>
              )}

              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Term</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University / Program</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <PTPRow 
                  key={req.id} 
                  request={req} 
                  onUpdate={fetchData}
                  showPlanColumn={filterType === 'Referral Letter'} 
                />
              ))
            ) : (
              <tr>
                <td colSpan={filterType === 'Referral Letter' ? 7 : 6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No {filterType === 'Referral Letter' ? 'referral requests' : 'completion reports'} found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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