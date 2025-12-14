'use client';

import { useState, useEffect, useCallback } from 'react';
import { TravelClearanceRow } from './TravelClearanceRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 
import type { SubmissionStatus, TravelPurpose } from '@/types/services';
import { TravelClearanceFiltersState } from './TravelClearanceFilters';

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
  filters: TravelClearanceFiltersState;
}

export function TravelClearanceTable({ searchTerm, filters }: TravelClearanceTableProps) {
  const [requests, setRequests] = useState<TravelRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        view: 'travel_view',
        orderBy: 'status',
        ascending: 'false',
      });

      const response = await fetch(`/api/admin/get_view?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const res = await response.json();
      const rows = res.data || [];

      const formatted: TravelRequestDetails[] = rows.map((e: any) => {
        const departureDate = new Date(e.departure);
        const arrivalDate = new Date(e.arrival);
        const durationDays = Math.ceil(
          (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: e.travel_id.toString(),
          spas_id: e.spas_id,
          purpose: e.type as TravelPurpose,
          scholarInfo: {
            name: e.full_name,
            spas_id: e.spas_id,
            email: e.email,
            contactNumber: e.contact_number,
            completeAddress: e.address || '',
          },
          placementInfo: {
            scholarshipType: e.scholarship_type,
            batch: Number(e.year_awarded), 
            university: e.university,
            program: e.program_course,
          },
          travelDetails: {
            destination: e.destination,
            departureDate: e.departure,
            arrivalDate: e.arrival,
            duration: `${durationDays} day${durationDays > 1 ? 's' : ''}`,
          },
          submissionInfo: {
            dateSubmitted: e.submitted_at,
            status: e.status as SubmissionStatus,
            adminComment: e.comment || '',
            delayReason: e.cause_of_submission_delay || '',
          },
          files: {
            requestLetter: e.request_letter_file_key,
            requestForm: e.completed_request_form_file_key,
            guaranteeLetter: e.guarantee_letter_file_key || undefined,
            deedOfUndertaking: e.deed_of_undertaking_file_key || undefined,
            coMakerEmployment: e.employment_file_key || undefined,
            coMakerId: e.valid_id_file_key || undefined,
          },
        };
      });

      setRequests(formatted);
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

  // Apply Filtering Logic
  const filteredRequests = requests.filter((r) => {
    // 1. Search Term (Scholar Name)
    const matchesSearch = r.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Status
    const matchesStatus = filters.status === 'All' || r.submissionInfo.status === filters.status;

    // 3. Purpose
    let matchesPurpose = true;
    if (filters.purpose !== 'All') {
      if (filters.purpose === 'Official Business Travel') {
        matchesPurpose = r.purpose === 'Official Business Travel';
      } else if (filters.purpose === 'Other') {
        // Matches Personal or anything else that isn't Official Business
        matchesPurpose = r.purpose !== 'Official Business Travel';
      }
    }

    // 4. University
    const matchesUniversity = filters.university === 'All' || r.placementInfo.university === filters.university;

    // 5. Date Range (Date Submitted)
    let matchesDate = true;
    if (filters.dateRange.start && filters.dateRange.end) {
      const submittedDate = new Date(r.submissionInfo.dateSubmitted);
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      
      // Set end date to end of the day to ensure inclusive comparison
      end.setHours(23, 59, 59, 999);
      
      matchesDate = submittedDate >= start && submittedDate <= end;
    }

    return matchesSearch && matchesStatus && matchesPurpose && matchesUniversity && matchesDate;
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University / Program</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Dates</th>
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