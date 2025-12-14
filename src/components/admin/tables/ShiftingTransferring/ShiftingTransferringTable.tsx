'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShiftingTransferringRow } from './ShiftingTransferringRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import { toast } from '@/components/ui/toaster';
import type { SubmissionStatus, ShiftingType } from '@/types/services';
import type { ShiftingTransferringFiltersState } from './ShiftingTransferringFilters';

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
    university?: string;
    program?: string;
    effectivity: string;
    duration: string;
  };
  submissionInfo: {
    dateSubmitted: string;
    status: SubmissionStatus;
    reason: string;
    adminComment?: string;
    delayReason?: string;
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
  filters: ShiftingTransferringFiltersState;
}

export function ShiftingTransferringTable({ searchTerm, filters }: ShiftingTransferringTableProps) {
  const [requests, setRequests] = useState<ShiftingRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        view: 'shifting_view',
        orderBy: 'status',
        ascending: 'false',
      });
      const response = await fetch(`/api/admin/get_view?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const res = await response.json();
      const rows = res.data || [];

      const formatted: ShiftingRequestDetails[] = rows.map((e: any) => {
        // Compute duration from OJT or just use semester string
        const duration = e.ojt ? `${e.ojt.semester}, Year ${e.ojt.year}` : '';

        return {
          id: e.id.toString(),
          spas_id: e.spas_id,
          applicationType: e.type as ShiftingType,
          scholarInfo: {
            name: e.full_name,
            spas_id: e.spas_id,
            email: e.email,
            contactNumber: e.contact_number,
            completeAddress: e.address || '',
          },
          currentPlacement: {
            scholarshipType: e.scholarship_type,
            batch: Number(e.year_awarded),
            university: e.university,
            program: e.program_course,
          },
          newPlacement: {
            university: e.new_school || e.university || '',
            program: e.new_course || e.program_course || '',
            effectivity: e.effectivity_of_shifting,
            duration,
          },
          submissionInfo: {
            dateSubmitted: e.created_at,
            status: e.status as SubmissionStatus,
            reason: e.reason,
            adminComment: e.comment || '',
          },
          files: {
            applicationForm: e.application_form_file_key,
            certificationAdmission: e.admission_cert_file_key,
            certificationAccredited: e.accredited_sub_file_key,
            certificationYearLevel: e.new_year_level_file_key,
            certificationGrades: e.all_grades_file_key,
            approvedProgram: e.approved_pos_file_key,
          },
        };
      });

      setRequests(formatted);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch requests.');
      toast.error("Error", {
        description: "Failed to load requests.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRequests = requests.filter((r) => {
    // 1. Search Term
    const matchesSearch = 
      r.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.spas_id.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Status
    const matchesStatus = filters.status === 'All' || r.submissionInfo.status === filters.status;

    // 3. Application Type
    const matchesType = filters.type === 'All' || r.applicationType === filters.type;

    // 4. University (Matching against current placement)
    const matchesUniversity = filters.university === 'All' || r.currentPlacement.university === filters.university;

    // 5. Date Range
    let matchesDate = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const date = new Date(r.submissionInfo.dateSubmitted);
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      // Set to end of day to include submission on the end date
      end.setHours(23, 59, 59, 999);
      matchesDate = date >= start && date <= end;
    }

    return matchesSearch && matchesStatus && matchesType && matchesUniversity && matchesDate;
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