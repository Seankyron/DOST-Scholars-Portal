'use client';

import { useState } from 'react';
import { Pagination } from '@/components/shared/Pagination';
import type {
  SubmissionStatus,
  YearLevel,
  Semester,
  Allowance,
  StipendUpdate,
  ScholarStatus,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { StipendTrackingRow } from './StipendTrackingRow';
import { UpdateStipendModal } from './UpdateStipendModal';
import { Checkbox } from '@/components/ui/checkbox';

export type ScholarStipendData = {
  received: number;
  pending: number;
  onHold: boolean;
  total: number;
  status: SubmissionStatus | ScholarStatus;
  breakdown: Allowance[];
  updates: StipendUpdate[];
  dateSubmitted: string; // <-- ADDED
};

const scholarPanelMockData: Record<string, ScholarStipendData> = {
  '1-1': {
    received: 24000,
    pending: 22000,
    onHold: true,
    total: 46000,
    status: 'On hold',
    dateSubmitted: '2023-10-15T09:30:00Z', // <-- ADDED
    breakdown: [
      // ...breakdown
      { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'On hold' },
      { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'On hold' },
      { name: 'Book Allowance', amount: 5000, status: 'On hold' },
      { name: 'Clothing Allowance', amount: 1000, status: 'On hold' },
    ],
    updates: [
      // ...updates
      {
        message:
          'Stipend On Hold: Your 1st Semester 2024 stipend (₱22,000) is on hold.',
        type: 'warning',
      },
      {
        message:
          'Admin Note: Your stipend is on hold pending submission of your Form 5.',
        type: 'info',
      },
    ],
  },
  '1-2': {
    received: 45000,
    pending: 0,
    onHold: false,
    total: 45000,
    status: 'Approved',
    dateSubmitted: '2024-03-20T14:00:00Z', // <-- ADDED
    breakdown: [
      // ...breakdown
      { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'Released' },
      { name: 'Book Allowance', amount: 5000, status: 'Released' },
    ],
    updates: [
      // ...updates
      {
        message:
          'Your stipend (₱45,000) for this semester has been fully released.',
        type: 'success',
      },
    ],
  },
  '2-1': {
    received: 0,
    pending: 45000,
    onHold: false,
    total: 45000,
    status: 'Processing',
    dateSubmitted: '2024-10-18T11:20:00Z', 
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'Pending' },
      { name: 'Book Allowance', amount: 5000, status: 'Pending' },
    ],
    updates: [
      {
        message:
          'Your grade submission has been approved. Your stipend is now processing. Please wait 21 working days.',
        type: 'info',
      },
    ],
  },
};


export interface StipendDetails {
  id: string;
  scholarInfo: {
    id: string;
    name: string;
    scholarId: string;
  };
  semesterInfo: {
    year: YearLevel;
    semester: Semester;
    academicYear: string;
  };
  stipend: {
    total: number;
    received: number;
    pending: number;
    status: ScholarStatus | SubmissionStatus;
    onHold: boolean;
    breakdown: Allowance[];
    updates: StipendUpdate[];
    dateSubmitted: string; 
  };
}

const mockStipendData: StipendDetails[] = [
  {
    id: 'stipend-1-1',
    scholarInfo: {
      id: 'scholar1',
      name: 'Joshua De Larosa',
      scholarId: '2021-00123',
    },
    semesterInfo: {
      year: '1st Year',
      semester: '1st Semester',
      academicYear: 'AY 2023-2024',
    },
    stipend: {
      ...scholarPanelMockData['1-1'],
      status: 'On hold',
    },
  },
  {
    id: 'stipend-1-2',
    scholarInfo: {
      id: 'scholar1',
      name: 'Joshua De Larosa',
      scholarId: '2021-00123',
    },
    semesterInfo: {
      year: '1st Year',
      semester: '2nd Semester',
      academicYear: 'AY 2023-2024',
    },
    stipend: {
      ...scholarPanelMockData['1-2'],
      status: 'Released',
    },
  },
  {
    id: 'stipend-2-1',
    scholarInfo: {
      id: 'scholar1',
      name: 'Joshua De Larosa',
      scholarId: '2021-00123',
    },
    semesterInfo: {
      year: '2nd Year',
      semester: '1st Semester',
      academicYear: 'AY 2024-2025',
    },
    stipend: {
      ...scholarPanelMockData['2-1'],
      status: 'Processing',
    },
  },
];


interface StipendTrackingTableProps {
  stipends: StipendDetails[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  selectedScholarIds: string[];
  onSelectAll: (ids: string[]) => void;
  onSelectOne: (id: string) => void;
}

export function StipendTrackingTable({
  stipends,
  loading,
  totalCount,
  currentPage,
  itemsPerPage,
  onPageChange,
  selectedScholarIds,
  onSelectAll,
  onSelectOne,
}: StipendTrackingTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStipend, setSelectedStipend] =
    useState<StipendDetails | null>(null);

  const isAllSelected =
    stipends.length > 0 &&
    selectedScholarIds.length === stipends.length;

  const handleSelectAll = (isChecking: boolean) => {
    if (isChecking) {
      onSelectAll(stipends.map((s) => s.id));
    } else {
      onSelectAll([]);
    }
  };

  const handleOpenModal = (stipend: StipendDetails) => {
    setSelectedStipend(stipend);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStipend(null);
  };
  const handleSave = (updatedStipend: StipendDetails) => {
    console.log('Saving stipend data:', updatedStipend);
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading stipend records...</p>
      </div>
    );
  }

  if (stipends.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No stipend records found.</p>
      </div>
    );
  }
  
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);


  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <Checkbox
                  checked={isAllSelected}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSelectAll(e.target.checked)
                  }
                  aria-label="Select all rows"
                />
              </th>
              {/* ... (other headers) ... */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scholar
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Semester
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Submitted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Received
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending / On Hold
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stipends.map((stipend) => (
              <StipendTrackingRow
                key={stipend.id}
                stipend={stipend}
                onUpdate={() => handleOpenModal(stipend)}
                isSelected={selectedScholarIds.includes(stipend.id)}
                onSelect={() => onSelectOne(stipend.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing {startItem}-{endItem} of {totalCount} records
        </p>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="sm:justify-self-center"
        />

        <div className="flex sm:justify-end">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {selectedStipend && (
        <UpdateStipendModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          stipendDetails={selectedStipend}
          onSave={handleSave}
        />
      )}
    </>
  );
}