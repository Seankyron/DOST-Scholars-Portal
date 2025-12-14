'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReimbursementRow } from './ReimbursementRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import { toast } from '@/components/ui/toaster';
import type { SubmissionStatus } from '@/types/services';
import type { ReimbursementFiltersState } from './ReimbursementFilters';

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
  filters: ReimbursementFiltersState;
}

export function ReimbursementTable({ searchTerm, filters }: ReimbursementTableProps) {
  const [requests, setRequests] = useState<ReimbursementRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        view: 'reimbursement_view',
        orderBy: 'status',
        ascending: 'false',
      });

      const response = await fetch(`/api/admin/get_view?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const res = await response.json();
      const rows = res.data || [];

      const formatted: ReimbursementRequestDetails[] = rows.map((e: any) => ({
        id: e.id.toString(),
        spas_id: e.spas_id,
        reimbursementType: e.type as 'Tuition Fee' | 'Transportation Allowance' | 'Review Fee' | 'Others',
        amount: e.amount,
        scholarInfo: {
          name: e.full_name,
          spas_id: e.spas_id,
          email: e.email,
          contactNumber: e.contact_number,
        },
        currentPlacement: {
          scholarshipType: e.scholarship_type,
          batch: Number(e.year_awarded),
          university: e.university,
          program: e.program_course,
        },
        submissionInfo: {
          dateSubmitted: e.created_at,
          status: e.status as SubmissionStatus,
          reason: e.reason,
          adminComment: e.comment || '',
        },
        files: {
          officialReceipt: e.receipt_file_key,
        },
      }));

      setRequests(formatted);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch requests.');
      toast.error("Error", {
        description: "Failed to load reimbursement requests.",
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
      r.spas_id.includes(searchTerm);

    // 2. Status
    const matchesStatus = filters.status === 'All' || r.submissionInfo.status === filters.status;

    // 3. Reimbursement Type
    const matchesType = filters.type === 'All' || r.reimbursementType === filters.type;

    // 4. University
    const matchesUniversity = filters.university === 'All' || r.currentPlacement.university === filters.university;

    // 5. Date Range
    let matchesDate = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const date = new Date(r.submissionInfo.dateSubmitted);
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      // Set to end of day
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