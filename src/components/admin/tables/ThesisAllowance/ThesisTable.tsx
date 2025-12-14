'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThesisRow } from './ThesisRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import type { ThesisRequestDetails } from '@/types/admin';
import type { ThesisFiltersState } from './ThesisFilters';

interface ThesisTableProps {
  searchTerm: string;
  filters: ThesisFiltersState;
}

export function ThesisTable({ searchTerm, filters }: ThesisTableProps) {
  const [requests, setRequests] = useState<ThesisRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
     const query = new URLSearchParams({
        view: 'thesis_view',
        orderBy: 'status',
        ascending: 'false',
      });
      const response = await fetch(`/api/admin/get_view?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const res = await response.json();
       const data: ThesisRequestDetails[] = res.data.map((item: any) => ({
         id: item.thesis_id?.toString() ?? '',
         scholarId: item.spas_id ?? '',
         status: item.status ?? 'Pending',
         percentage: item.type ? parseInt(item.type.replace('%','')) : 0,
         dateSubmitted: item.submitted_at ?? new Date().toISOString(),
         yearLevel: 'N/A',
         semester: item.semester ?? 'N/A',
         academicYear: item.academic_year ?? 'N/A',
         adminComment: item.comment || '',
         
         // Files
         abstract: item.abstract_thesis_file_key ?? '',
         approvalSheet: item.approval_file_key ?? '',
         registrationForm: item.cor_file_key ?? '',
         finalManuscript: item.final_thesis_file_key ?? '',

         scholarInfo: {
           name: item.full_name ?? 'Unknown',
           spas_id: item.spas_id ?? '',
           email: item.email ?? '',
           contactNumber: item.contact_number ?? '',
           yearAwarded: item.year_awarded ? Number(item.year_awarded) : 0,
           program: item.program_course ?? '',
           university: item.university ?? '',
           scholarshipType: item.scholarship_type ?? '',
         },
       }));

       setRequests(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch thesis requests.');
      toast.error("Error", {
        description: "Failed to load thesis requests.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Combined Filtering Logic
  const filteredRequests = requests.filter((r) => {
    // 1. Search Term (Scholar Name)
    if (searchTerm && !r.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // 2. Status
    if (filters.status !== 'All' && r.status !== filters.status) {
      return false;
    }

    // 4. Semester
    if (filters.semester !== 'All' && r.semester !== filters.semester) {
      return false;
    }

    // 5. Academic Year
    if (filters.academicYear !== 'All' && r.academicYear !== filters.academicYear) {
      return false;
    }

    // 6. University
    if (filters.university !== 'All' && r.scholarInfo.university !== filters.university) {
      return false;
    }

    // 7. Year (Based on Submission Date)
    if (filters.year !== 'All') {
      const submissionYear = new Date(r.dateSubmitted).getFullYear().toString();
      if (submissionYear !== filters.year) return false;
    }

    // 8. Date Range (Submission Date)
    if (filters.dateRange.start || filters.dateRange.end) {
      const submissionDate = new Date(r.dateSubmitted);
      // Normalize to start of day for comparison
      submissionDate.setHours(0, 0, 0, 0);

      if (filters.dateRange.start) {
        const start = new Date(filters.dateRange.start);
        start.setHours(0, 0, 0, 0);
        if (submissionDate < start) return false;
      }
      
      if (filters.dateRange.end) {
        const end = new Date(filters.dateRange.end);
        end.setHours(0, 0, 0, 0);
        if (submissionDate > end) return false;
      }
    }

    return true;
  });

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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Term</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University / Program</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((req) => (
              <ThesisRow 
                key={req.id} 
                request={req} 
                onUpdate={fetchData}
              />
            ))}
          </tbody>
        </table>
        
        {filteredRequests.length === 0 && (
           <p className="text-sm text-gray-500 text-center py-8">No requests found matching your filters.</p>
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