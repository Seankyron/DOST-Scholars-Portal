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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: TravelRequestDetails[] = [
        {
          id: '1',
          spas_id: '2021-001',
          purpose: 'Official Business Travel',
          scholarInfo: {
            name: 'Juan Dela Cruz',
            spas_id: '2021-001',
            email: 'juan.delacruz@example.com',
            contactNumber: '09123456789',
            completeAddress: 'Manila',
          },
          placementInfo: {
            scholarshipType: 'RA 7687',
            batch: 2021,
            university: 'UP Diliman',
            program: 'BS Physics',
          },
          travelDetails: {
            destination: 'Tokyo, Japan',
            departureDate: '2024-06-15',
            arrivalDate: '2024-06-20',
            duration: '5 Days'
          },
          submissionInfo: {
            dateSubmitted: new Date().toISOString(),
            status: 'Pending',
          },
          files: {
            requestLetter: 'letter_to_director.pdf',
            requestForm: 'travel_request_form.pdf',
            guaranteeLetter: 'employer_guarantee.pdf',
          },
        },
        // Late Submission Mock Data
        {
          id: '3',
          spas_id: '2022-055',
          purpose: 'Other',
          scholarInfo: {
            name: 'Isabella Late',
            spas_id: '2022-055',
            email: 'isabella.late@example.com',
            contactNumber: '09171234567',
            completeAddress: 'Cebu City',
          },
          placementInfo: {
            scholarshipType: 'Merit',
            batch: 2022,
            university: 'San Carlos University',
            program: 'BS Biology',
          },
          travelDetails: {
            destination: 'Seoul, South Korea',
            departureDate: '2024-05-20', 
            arrivalDate: '2024-05-25',
            duration: '5 Days'
          },
          submissionInfo: {
            dateSubmitted: new Date().toISOString(),
            status: 'Pending',
            delayReason: 'I received my Visa approval late and could not submit the requirements earlier.', 
          },
          files: {
            requestLetter: 'letter.pdf',
            requestForm: 'form.pdf',
            deedOfUndertaking: 'deed.pdf',
            coMakerEmployment: 'employ.pdf',
            coMakerId: 'id.pdf'
          },
        },
        {
          id: '4',
          spas_id: '2023-101',
          purpose: 'Official Business Travel',
          scholarInfo: {
            name: 'Marco Polo',
            spas_id: '2023-101',
            email: 'marco.polo@example.com',
            contactNumber: '09998887777',
            completeAddress: 'Davao City',
          },
          placementInfo: {
            scholarshipType: 'RA 7687',
            batch: 2023,
            university: 'Ateneo de Davao',
            program: 'BS Environmental Science',
          },
          travelDetails: {
            destination: 'Bangkok, Thailand',
            departureDate: '2024-09-10',
            arrivalDate: '2024-09-15',
            duration: '5 Days'
          },
          submissionInfo: {
            dateSubmitted: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            status: 'Resubmit',
            // Triggers "To Resubmit" on Request Letter
            adminComment: 'The Request Letter does not indicate the specific dates of travel. Please revise and resubmit.', 
          },
          files: {
            requestLetter: 'incomplete_letter.pdf',
            requestForm: 'form.pdf',
            guaranteeLetter: 'guarantee.pdf',
          },
        },
      ];

      setRequests(mockData);
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