'use client';

import { useState, useEffect, useCallback } from 'react';
import { PTPRow } from './PTPRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import type { PTPRequestDetails } from '@/types/admin';
// Import the state interface only, not the component
import type { PTPFiltersState } from './PTPFilters'; 

interface PTPTableProps {
  searchTerm: string;
  filterType: 'Referral Letter' | 'Program Completion';
  filters: PTPFiltersState; // Accept filters from parent
}

export function PTPTable({ searchTerm, filterType, filters }: PTPTableProps) {
  const [requests, setRequests] = useState<PTPRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        view: 'ptp_view',
        orderBy: 'ptp_created_at',
        ascending: 'false',
      });
      
      const response = await fetch(`/api/admin/get_view?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const res = await response.json();
      
      const allRequests: PTPRequestDetails[] = res.data.map((item: any) => ({
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
          semester: "Midyear", 
          academicYear: item.academic_year || 'N/A', 
          trainingYear: item.year_awarded 
            ? `${Math.max(1, new Date().getFullYear() - Number(item.year_awarded) + 1)}th Year` 
            : "N/A",
          plan: item.ptp_plan ?? undefined,
          adminComment: item.ptp_comment || item.comment || '', 
        },
        
        files: {
            grades: item.grade_file_key || undefined,
            replySlip: item.reply_slip_file_key || undefined,
            form126: item.form_126_file_key || undefined,
            form127: item.form_127_file_key || undefined,
            form128: item.form_128_file_key || undefined,
            dtr: item.dtr_file_key || undefined,
            certCompletion: item.training_completion_file_key || undefined,
            curriculum: item.curriculum_file_key || undefined, 
        }
      }));

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

  // Apply filtering logic using the passed 'filters' prop
  const filteredRequests = requests.filter((r) => {
    // 1. Search Term
    const matchesSearch = r.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Status
    const matchesStatus = filters.status === 'All' || r.submissionInfo.status === filters.status;

    // 3. Training Year
    const matchesTrainingYear = filters.trainingYear === 'All' 
      || r.placementInfo.batch.toString() === filters.trainingYear;

    // 4. Semester
    const matchesSemester = filters.semester === 'All' || r.submissionInfo.semester === filters.semester;

    // 5. Academic Year
    const matchesAcademicYear = filters.academicYear === 'All' 
      || r.submissionInfo.academicYear === filters.academicYear
      || `AY ${r.submissionInfo.academicYear}` === filters.academicYear;

    // 6. University
    const matchesUniversity = filters.university === 'All' || r.placementInfo.university === filters.university;

    // 7. Plan
    const matchesPlan = filters.plan === 'All' || (r.submissionInfo.plan && r.submissionInfo.plan === filters.plan);

    // 8. Date Range
    let matchesDate = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const submittedDate = new Date(r.submissionInfo.dateSubmitted);
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      end.setHours(23, 59, 59, 999); 
      matchesDate = submittedDate >= start && submittedDate <= end;
    }

    return matchesSearch 
      && matchesStatus 
      && matchesTrainingYear 
      && matchesSemester 
      && matchesAcademicYear 
      && matchesUniversity 
      && matchesPlan 
      && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-dost-title" />
      </div>
    );
  }

  if (error) return <p className="p-4 text-red-500 text-center">{error}</p>;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              
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
                  No {filterType === 'Referral Letter' ? 'referral requests' : 'completion reports'} found matching your filters.
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