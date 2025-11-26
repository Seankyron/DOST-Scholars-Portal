'use client';

import { useState, useEffect, useCallback } from 'react';
import { TravelClearanceRow } from './TravelClearanceRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import type { SubmissionStatus, TravelPurpose } from '@/types/services';

export interface TravelRequestDetails {
  id: string;
  spas_id: string;
  purpose: TravelPurpose;
  scholarInfo: {
    name: string;
    spas_id: string;
    email: string;
    contactNumber: string;
    completeAddress: string;
  };
  placementInfo: {
    scholarshipType: string;
    batch: number;
    university: string;
    program: string;
  };
  travelDetails: {
    destination: string;
    departureDate: string;
    arrivalDate: string;
    duration: string;
  };
  submissionInfo: {
    dateSubmitted: string;
    status: SubmissionStatus;
    adminComment?: string;
    delayReason?: string;
  };
  files: {
    requestLetter: string;
    requestForm: string;
    guaranteeLetter?: string;
    deedOfUndertaking?: string;
    coMakerEmployment?: string;
    coMakerId?: string;
  };
}

interface TravelClearanceTableProps {
  searchTerm: string;
}

export function TravelClearanceTable({ searchTerm }: TravelClearanceTableProps) {
  const [requests, setRequests] = useState<TravelRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/admin/travel/get');
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const res = await response.json();
    const data: TravelRequestDetails[] = res.submissions.map((item: any) => {

      const start = new Date(item.departure);
      const end = new Date(item.arrival);
      const durationMs = end.getTime() - start.getTime();
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)); 

      return {
        id: String(item.travel_id), 
        spas_id: item.spas_id,
        purpose: item.type as TravelPurpose,
        
        scholarInfo: {
          name: item.full_name,
          spas_id: item.spas_id,
          email: item.email,
          contactNumber: item.contact_number,
          completeAddress: item.address, 
        },
        
        placementInfo: {
          scholarshipType: item.scholarship_type,
          batch: Number(item.year_awarded), 
          university: item.university.trim(),
          program: item.program_course,
        },
        
        travelDetails: {
          destination: item.destination,
          departureDate: item.departure,
          arrivalDate: item.arrival,
          duration: `${durationDays} days`, 
        },
        
        submissionInfo: {
          dateSubmitted: item.submitted_at,
          status: item.status as SubmissionStatus,
          adminComment: item.comment || undefined, 
          delayReason: item.cause_of_submission_delay || undefined,
        },
        
        files: {
          requestLetter: item.request_letter_file_key || '',
          requestForm: item.completed_request_form_file_key || '',
          guaranteeLetter: item.guarantee_letter_file_key || undefined,
          deedOfUndertaking: item.deed_of_undertaking_file_key || undefined,
          coMakerEmployment: item.employment_file_key || undefined,
          coMakerId: item.valid_id_file_key || undefined,
        },
      };
    });

    setRequests(data)
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University / Program</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Dates</th>
              {/* ADDED: Date Submitted Header */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((req) => (
              <TravelClearanceRow 
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