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

// --- 1. COPIED FROM SCHOLAR PANEL (RENAMED) ---
// This is the scholar's data type
type ScholarStipendData = {
  received: number;
  pending: number;
  onHold: boolean;
  total: number;
  status: SubmissionStatus | ScholarStatus;
  breakdown: Allowance[];
  updates: StipendUpdate[];
};

// This is the scholar's mock data, defined FIRST
const scholarPanelMockData: Record<string, ScholarStipendData> = {
  '1-1': {
    received: 24000, // 3 x 8k
    pending: 22000, // 2 x 8k + 5k book + 5k clothing
    onHold: true,
    total: 46000, // 5 x 8k + 5k + 5k
    status: 'On hold',
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'On hold' },
      { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'On hold' },
      { name: 'Book Allowance', amount: 5000, status: 'On hold' },
      { name: 'Clothing Allowance', amount: 1000, status: 'On hold' }, // Only appears here
    ],
    updates: [
      {
        message:
          'Stipend On Hold: Your 1st Semester 2024 stipend (₱26,000) is on hold.', // Updated amount
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
    received: 45000, // 5 x 8k + 5k book
    pending: 0,
    onHold: false,
    total: 45000, // 5 x 8k + 5k book
    status: 'Approved',
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'Released' },
      { name: 'Book Allowance', amount: 5000, status: 'Released' },
      // Clothing Allowance removed
    ],
    updates: [
      {
        message:
          'Your stipend (₱45,000) for this semester has been fully released.',
        type: 'success',
      },
    ],
  },
  '2-1': {
    received: 0,
    pending: 45000, // 5 x 8k + 5k book
    onHold: false,
    total: 45000, // 5 x 8k + 5k book
    status: 'Processing',
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'Pending' },
      { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'Pending' },
      { name: 'Book Allowance', amount: 5000, status: 'Pending' },
      // Clothing Allowance removed
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

// This is the full data structure an admin will manage per scholar, per semester
export interface StipendDetails {
  id: string; // Unique ID for this stipend record
  scholarInfo: {
    id: string; // Scholar's user ID
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
  };
}

// Mock data based on the scholar view
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
      // --- 2. UPDATED to use the renamed variable ---
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
      // --- 2. UPDATED to use the renamed variable ---
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
      // --- 2. UPDATED to use the renamed variable ---
      ...scholarPanelMockData['2-1'],
      status: 'Processing',
    },
  },
];

interface StipendTrackingTableProps {
  searchTerm: string;
}

export function StipendTrackingTable({
  searchTerm,
}: StipendTrackingTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStipend, setSelectedStipend] =
    useState<StipendDetails | null>(null);

  const filteredData = mockStipendData.filter((s) =>
    s.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (stipend: StipendDetails) => {
    setSelectedStipend(stipend);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStipend(null);
  };

  const handleSave = (updatedStipend: StipendDetails) => {
    // In a real app, this would be an API call
    console.log('Saving stipend data:', updatedStipend);
    // Here you would update your main data source (e.g., SWR, React Query)
    handleCloseModal();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
            {filteredData.map((stipend) => (
              <StipendTrackingRow
                key={stipend.id}
                stipend={stipend}
                onUpdate={() => handleOpenModal(stipend)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing 1-{filteredData.length} of {filteredData.length} records
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