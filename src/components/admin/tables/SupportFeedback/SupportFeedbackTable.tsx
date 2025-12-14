'use client';

import { useState, useEffect, useCallback } from 'react';
import { SupportFeedbackRow } from './SupportFeedbackRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import { toast } from '@/components/ui/toaster';
import type { SubmissionStatus } from '@/types/services';
import type { SupportFeedbackFiltersState } from './SupportFeedbackFilters';

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
  filters: SupportFeedbackFiltersState;
}

export function SupportFeedbackTable({ searchTerm, filters }: SupportFeedbackTableProps) {
  const [requests, setRequests] = useState<SupportFeedbackRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
      setLoading(true);
      setError(null);
  
      try {
        const query = new URLSearchParams({
          view: 'feedback_view',
          orderBy: 'status',
          ascending: 'false',
        });
  
        const response = await fetch(`/api/admin/get_view?${query.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch data');
  
        const res = await response.json();
        const rows = res.data || [];
        const formatted: SupportFeedbackRequestDetails[] = rows.map((row: any) => ({
              id: String(row.id),
              spas_id: row.spas_id,

              scholarInfo: {
                name: row.full_name,
                spas_id: row.spas_id,
                email: row.email,
                contactNumber: row.contact_number,
              },

              currentPlacement: {
                scholarshipType: row.scholarship_type,
                batch: Number(row.year_awarded),
                university: row.university,
                program: row.program_course,
              },

              submissionInfo: {
                dateSubmitted: row.created_at,
                status: row.status,
                category: row.type,
                description: row.reason,
                adminResponse: row.comment || undefined,
              },

              files: {
                attachment: row.attachment || undefined,
              },
            }));
            
        setRequests(formatted);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch requests.');
        toast.error("Error", {
          description: "Failed to load Support and Feedback.",
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
      r.spas_id.includes(searchTerm) ||
      r.submissionInfo.category.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Status
    const matchesStatus = filters.status === 'All' || r.submissionInfo.status === filters.status;

    // 3. Category
    const matchesCategory = filters.category === 'All' || r.submissionInfo.category === filters.category;

    // 4. Date Range
    let matchesDate = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const date = new Date(r.submissionInfo.dateSubmitted);
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      // Set to end of day
      end.setHours(23, 59, 59, 999);
      matchesDate = date >= start && date <= end;
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
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