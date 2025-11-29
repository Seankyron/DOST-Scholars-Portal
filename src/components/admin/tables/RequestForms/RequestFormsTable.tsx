'use client';

import { useState, useEffect, useCallback } from 'react';
import { RequestFormsRow } from './RequestFormsRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import { toast } from '@/components/ui/toaster';
import type { SubmissionStatus, RequestFormType } from '@/types/services';

export interface RequestFormDetails {
  id: string;
  spas_id: string;
  requestType: RequestFormType;
  scholarInfo: {
    name: string;
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
    reason: string; 
    details?: string; 
    adminComment?: string;
  };
  files: {
    supportingDocument?: string; 
  };
}

interface RequestFormsTableProps {
  searchTerm: string;
}

export function RequestFormsTable({ searchTerm }: RequestFormsTableProps) {
  const [requests, setRequests] = useState<RequestFormDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        view: 'request_forms_view',
        orderBy: 'status',
        ascending: 'false',
      });

      const response = await fetch(`/api/admin/get_view?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const res = await response.json();
      const rows = res.data || [];

      const formatted: RequestFormDetails[] = rows.map((e: any) => ({
        id: e.id.toString(),
        spas_id: e.spas_id,
        requestType: e.requested_document as RequestFormType,
        scholarInfo: {
          name: e.full_name,
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
          dateSubmitted: e.requested_at,
          status: e.status as SubmissionStatus,
          reason: e.reason,
          details: e.updated_at ? `Last updated on ${e.updated_at}` : undefined,
          adminComment: e.comment || undefined,
        },
        files: {
          supportingDocument: e.supporting_document || undefined,
        },
      }));

      setRequests(formatted);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch request forms.');
      toast.error('Error', { description: 'Failed to load request forms.' });
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
    r.requestType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((req) => (
              <RequestFormsRow 
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