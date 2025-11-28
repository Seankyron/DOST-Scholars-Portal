'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThesisRow } from './ThesisRow';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ThesisRequestDetails } from '@/types/admin';

interface ThesisTableProps {
  searchTerm: string;
}

export function ThesisTable({ searchTerm }: ThesisTableProps) {
  const [requests, setRequests] = useState<ThesisRequestDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      
      
      // const mockData: ThesisRequestDetails[] = [
      //   {
      //     id: '1',
      //     scholarId: 'auth-001',
      //     status: 'Pending',
      //     percentage: 90,
      //     dateSubmitted: new Date().toISOString(),
      //     yearLevel: '4th Year',
      //     semester: '1st Semester',
      //     academicYear: '2023-2024',
      //     abstract: 'Abstract_DelaCruz.pdf',
      //     approvalSheet: 'Approval_DelaCruz.pdf',
      //     registrationForm: 'RegForm_1stSem.pdf',
      //     scholarInfo: {
      //       name: 'Juan Dela Cruz',
      //       spas_id: '2020-00123',
      //       email: 'juan.delacruz@gmail.com',
      //       contactNumber: '09171234567',
      //       yearAwarded: 2020,
      //       program: 'BS Computer Science',
      //       university: 'University of the Philippines',
      //       scholarshipType: 'RA 7687',
      //     },
      //   },
      //   {
      //     id: '2',
      //     scholarId: 'auth-002',
      //     status: 'Approved',
      //     percentage: 10,
      //     dateSubmitted: new Date(Date.now() - 172800000).toISOString(),
      //     yearLevel: '4th Year',
      //     semester: '2nd Semester',
      //     academicYear: '2023-2024',
      //     finalManuscript: 'Final_Manuscript_Clara.pdf',
      //     scholarInfo: {
      //       name: 'Maria Clara',
      //       spas_id: '2020-00124',
      //       email: 'maria.clara@yahoo.com',
      //       contactNumber: '09987654321',
      //       yearAwarded: 2020,
      //       program: 'BS Biology',
      //       university: 'Ateneo de Manila University',
      //       scholarshipType: 'Merit',
      //     },
      //   },
      //   {
      //     id: '3',
      //     scholarId: 'auth-003',
      //     status: 'Resubmit',
      //     percentage: 100,
      //     dateSubmitted: new Date(Date.now() - 86400000).toISOString(),
      //     yearLevel: '5th Year',
      //     semester: '1st Semester',
      //     academicYear: '2023-2024',
      //     abstract: 'Abstract_Rizal.pdf',
      //     approvalSheet: 'Approval_Rizal.pdf',
      //     finalManuscript: 'Final_Manuscript_Rizal.pdf',
      //     adminComment: 'Please re-upload the Approval Sheet. The signature is blurred.',
      //     scholarInfo: {
      //       name: 'Jose Rizal',
      //       spas_id: '2019-00555',
      //       email: 'pepe.rizal@gmail.com',
      //       contactNumber: '09191239876',
      //       yearAwarded: 2019,
      //       program: 'BS Civil Engineering',
      //       university: 'Mapua University',
      //       scholarshipType: 'RA 7687',
      //     },
      //   },
      // ];
       const response = await fetch('/api/admin/thesis/get');
                if (!response.ok) throw new Error('Failed to fetch data');
      
                const res = await response.json();
      
                const data: ThesisRequestDetails[] = res.submissions.map((item: any) => ({
                  id: item.thesis_id.toString(),
                  scholarId: item.spas_id,
                  status: item.status ?? '',
                  percentage: parseInt(item.type.replace('%','')) ?? '',
                  dateSubmitted: item.submitted_at,
                  yearLevel: 'Wala sa db, dont know where to add',
                  semester: 'wala sa db, dont know where to add',
                  academicYear: 'wala sa db, dont know where to add',
                  abstract: item.abstract_thesis_file_key ?? '',
                  approvalSheet: item.approval_file_key ?? '',
                  registrationForm: item.cor_file_key ?? '',
                  scholarInfo: {
                    name: item.full_name,
                    spas_id: item.spas_id,
                    email: item.email,
                    contactNumber: item.contact_number,
                    yearAwarded: item.year_awarded,
                    program: item.program_course,
                    university: item.university,
                    scholarshipType: item.scholarship_type,
                  },
                }
                ));
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch thesis requests.');
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