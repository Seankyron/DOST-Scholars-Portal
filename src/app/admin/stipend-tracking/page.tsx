'use client';

import { useState, useEffect, useMemo } from 'react';
import { StipendTrackingTable } from '@/components/admin/tables/StipendTracking/StipendTrackingTable';
import { StipendTrackingFilters } from '@/components/admin/tables/StipendTracking/StipendTrackingFilters';
import { SearchInput } from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import {
  BulkStipendActionModal,
  type BulkAction,
  type BulkActionPayload,
} from '@/components/admin/tables/StipendTracking/BulkStipendActtionModal';
import { Check, Loader2, X } from 'lucide-react';
import { toast } from '@/components/ui/toaster';
import { useRouter } from 'next/navigation';
import type {
  StipendDetails,
  ScholarStipendData,
} from '@/components/admin/tables/StipendTracking/StipendTrackingTable';
import { useDebounce } from '@/hooks/useDebounce';

const scholarPanelMockData: Record<string, ScholarStipendData> = {
  '1-1': {
    received: 24000,
    pending: 22000,
    onHold: true,
    total: 46000,
    status: 'On hold',
    dateSubmitted: '2023-10-15T09:30:00Z',
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'On hold' },
      { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'On hold' },
      { name: 'Book Allowance', amount: 5000, status: 'On hold' },
      { name: 'Clothing Allowance', amount: 1000, status: 'On hold' },
    ],
    updates: [
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
    dateSubmitted: '2024-03-20T14:00:00Z',
    breakdown: [
      { name: 'Monthly Stipend (Month 1)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 2)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 3)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 4)', amount: 8000, status: 'Released' },
      { name: 'Monthly Stipend (Month 5)', amount: 8000, status: 'Released' },
      { name: 'Book Allowance', amount: 5000, status: 'Released' },
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
  {
    id: 'stipend-2-2',
    scholarInfo: {
      id: 'scholar2',
      name: 'Maria Clara',
      scholarId: '2022-00456',
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
];
const ITEMS_PER_PAGE = 7;

export default function AdminStipendTrackingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStipendIds, setSelectedStipendIds] = useState<string[]>([]);
  
  const [bulkAction, setBulkAction] = useState<BulkAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredData = useMemo(() => {
    return mockStipendData.filter((s) =>
      s.scholarInfo.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm]);

  const paginatedData = useMemo(() => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE;
    return filteredData.slice(from, to);
  }, [filteredData, currentPage]);
  
  const uniquePendingAllowances = useMemo(() => {
    const selectedStipends = mockStipendData.filter((s) =>
      selectedStipendIds.includes(s.id)
    );
    const allPending = selectedStipends.flatMap(
      (s) => s.stipend.breakdown
    );
    const pendingNames = allPending
      .filter((a) => a.status === 'Pending' || a.status === 'On hold')
      .map((a) => a.name);
    return [...new Set(pendingNames)];
  }, [selectedStipendIds]);

  const handleSelectOne = (id: string) => {
    setSelectedStipendIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleSelectAll = (ids: string[]) => {
    if (ids.length > 0 && selectedStipendIds.length === ids.length) {
      setSelectedStipendIds([]);
    } else {
      setSelectedStipendIds(ids);
    }
  };
  const handleBulkActionConfirm = async (payload: BulkActionPayload) => {
    setIsSubmitting(true);

    if (bulkAction === 'Release') {
      console.log('RELEASING allowances:', payload.allowancesToRelease, 'for scholars:', selectedStipendIds);
      await new Promise((res) => setTimeout(res, 1000));
      toast.success(
        `Released ${payload.allowancesToRelease?.length} allowance type(s) for ${selectedStipendIds.length} scholar(s).`
      );
    } else if (bulkAction === 'On Hold') {
      console.log('Placing ON HOLD:', selectedStipendIds, 'Note:', payload.adminNote);
      await new Promise((res) => setTimeout(res, 1000));
      toast.warning(`Placed ${selectedStipendIds.length} stipend(s) on hold.`);
    }

    setIsSubmitting(false);
    setBulkAction(null); // Close the modal
    setSelectedStipendIds([]);
    // router.refresh();
  };
  
  const selectedCount = selectedStipendIds.length;
  const isActionDisabled = selectedCount === 0 || isSubmitting;

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-dost-title">
          Stipend Management
        </h1>

        <StipendTrackingFilters />

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold text-gray-800">
                Scholar Stipends
                {selectedCount > 0 && (
                  <span className="text-sm text-gray-500 font-medium">
                    ({selectedCount} selected)
                  </span>
                )}
              </h2>
              <Button
                variant="primary"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setBulkAction('Release')}
                disabled={isActionDisabled}
              >
                {isSubmitting && bulkAction === 'Release' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                Bulk Release
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setBulkAction('On Hold')}
                disabled={isActionDisabled}
              >
                {isSubmitting && bulkAction === 'On Hold' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
                Bulk On Hold
              </Button>
            </div>
            <SearchInput
              placeholder="Search Scholars..."
              onSearch={setSearchTerm}
              className="w-full sm:max-w-xs"
            />
          </div>
          <StipendTrackingTable
            stipends={paginatedData}
            loading={loading}
            totalCount={filteredData.length}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            selectedScholarIds={selectedStipendIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
          />
        </div>
      </div>

      {bulkAction && (
        <BulkStipendActionModal
          isOpen={!!bulkAction}
          onClose={() => setBulkAction(null)}
          onConfirm={handleBulkActionConfirm}
          action={bulkAction}
          pendingAllowances={uniquePendingAllowances}
          selectedCount={selectedCount}
          isLoading={isSubmitting}
        />
      )}
    </>
  );
}