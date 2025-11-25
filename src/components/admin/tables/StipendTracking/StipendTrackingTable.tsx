'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Pagination } from '@/components/shared/Pagination';
import type {
  SubmissionStatus,
  YearLevel,
  Semester,
  Allowance,
  ScholarStatus,
} from '@/types';
import { StipendUpdate } from '@/components/scholar/services/StipendTracking/StipendUpdates';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Check, X } from 'lucide-react';
import { StipendTrackingRow } from './StipendTrackingRow';
import { UpdateStipendModal } from './UpdateStipendModal';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/toaster';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import {
  BulkStipendActionModal,
  type BulkAction,
  type BulkActionPayload,
} from '@/components/admin/tables/StipendTracking/BulkStipendActtionModal';

// --- Types ---
export type ScholarStipendData = {
  received: number;
  pending: number;
  onHold: boolean;
  total: number;
  status: SubmissionStatus | ScholarStatus;
  breakdown: Allowance[];
  updates: StipendUpdate[];
  dateSubmitted: string;
};

export interface StipendDetails {
  id: string;
  scholarInfo: {
    id: string;
    name: string;
    scholarId: string;
    email: string;
    contactNumber: string;
  };
  placementInfo: {
    university: string;
    program: string;
  };
  semesterInfo: {
    year: YearLevel;
    semester: Semester;
    academicYear: string;
  };
  stipend: ScholarStipendData;
}

// --- Mock Data ---
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
        message: 'Stipend On Hold: Your 1st Semester 2024 stipend (₱22,000) is on hold.',
        type: 'warning',
      },
      {
        message: 'Admin Note: Your stipend is on hold pending submission of your Form 5.',
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
        message: 'Your stipend (₱45,000) for this semester has been fully released.',
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
        message: 'Your grade submission has been approved. Your stipend is now processing. Please wait 21 working days.',
        type: 'info',
      },
    ],
  },
};

const ITEMS_PER_PAGE = 7;

// --- Component Definition ---

interface StipendTrackingTableProps {
  searchTerm: string;
}

export function StipendTrackingTable({ searchTerm }: StipendTrackingTableProps) {
  // Data State
  const [stipends, setStipends] = useState<StipendDetails[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selection State
  const [selectedStipendIds, setSelectedStipendIds] = useState<string[]>([]);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStipend, setSelectedStipend] = useState<StipendDetails | null>(null);
  
  // Bulk Action States
  const [bulkAction, setBulkAction] = useState<BulkAction | null>(null);
  const [pendingPayload, setPendingPayload] = useState<BulkActionPayload | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch Logic ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
      
      const mockData: StipendDetails[] = [
        {
          id: 'stipend-1-1',
          scholarInfo: {
            id: 'scholar1',
            name: 'Joshua De Larosa',
            scholarId: '2021-00123',
            email: 'joshua.delarosa@example.com',
            contactNumber: '0917-123-4567',
          },
          placementInfo: {
            university: 'University of the Philippines - Diliman',
            program: 'BS Computer Science',
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
            email: 'joshua.delarosa@example.com',
            contactNumber: '0917-123-4567',
          },
          placementInfo: {
            university: 'University of the Philippines - Diliman',
            program: 'BS Computer Science',
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
            email: 'joshua.delarosa@example.com',
            contactNumber: '0917-123-4567',
          },
          placementInfo: {
            university: 'University of the Philippines - Diliman',
            program: 'BS Computer Science',
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
              email: 'maria.clara@example.com',
              contactNumber: '0998-765-4321',
            },
            placementInfo: {
              university: 'Ateneo de Manila University',
              program: 'BS Physics',
            },
            semesterInfo: {
              year: '1st Year',
              semester: '1st Semester',
              academicYear: 'AY 2023-2024',
            },
            stipend: {
              ...scholarPanelMockData['1-1'], // Reusing for simplicity
              status: 'On hold',
            },
        },
      ];
      setStipends(mockData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch stipend records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Filtering & Pagination ---
  const filteredData = useMemo(() => {
    if (!stipends) return [];
    return stipends.filter((s) =>
      s.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stipends, searchTerm]);

  const paginatedData = useMemo(() => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE;
    return filteredData.slice(from, to);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length);

  // --- Selection Logic ---
  const handleSelectOne = (id: string) => {
    setSelectedStipendIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedStipendIds(paginatedData.map((s) => s.id));
    } else {
      setSelectedStipendIds([]);
    }
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((s) => selectedStipendIds.includes(s.id));

  // --- Bulk Action Logic ---
  const uniquePendingAllowances = useMemo(() => {
    const selectedStipends = stipends.filter((s) =>
      selectedStipendIds.includes(s.id)
    );
    const allPending = selectedStipends.flatMap((s) => s.stipend.breakdown);
    const pendingNames = allPending
      .filter((a) => a.status === 'Pending' || a.status === 'On hold')
      .map((a) => a.name);
    return [...new Set(pendingNames)];
  }, [selectedStipendIds, stipends]);

  const handleBulkActionInitiate = (payload: BulkActionPayload) => {
    setPendingPayload(payload);
    setBulkAction(null); 
    setIsConfirmOpen(true);
  };

  const handleBulkActionExecute = async () => {
    if (!pendingPayload) return;
    setIsSubmitting(true);
    try {
        await new Promise((res) => setTimeout(res, 1000));
        
        const actionType = pendingPayload.adminNote ? 'Placed on hold' : 'Released';
        if (actionType === 'Released') {
            toast.success(`Successfully released allowances for ${selectedStipendIds.length} scholar(s).`);
        } else {
            toast.warning(`Placed ${selectedStipendIds.length} stipend(s) on hold.`);
        }
        setIsConfirmOpen(false);
        setPendingPayload(null);
        setSelectedStipendIds([]);
        fetchData(); // Automatic refresh
    } catch (error) {
        console.error(error);
        toast.error("An error occurred while processing the request.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- Single Update Logic ---
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
    fetchData(); // Automatic refresh
  };

  const selectedCount = selectedStipendIds.length;

  if (loading && stipends.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-dost-title" />
      </div>
    );
  }

  return (
    <>
      {/* Bulk Action Bar */}
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between min-h-[50px]">
        <div className="flex items-center gap-2">
            {selectedCount > 0 ? (
                <>
                <span className="text-sm font-medium text-gray-700 mr-2">
                    {selectedCount} selected
                </span>
                <Button
                    variant="primary"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 h-8"
                    onClick={() => setBulkAction('Release')}
                    disabled={isSubmitting}
                >
                    <Check className="h-3 w-3 mr-1.5" />
                    Release
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 h-8"
                    onClick={() => setBulkAction('On Hold')}
                    disabled={isSubmitting}
                >
                    <X className="h-3 w-3 mr-1.5" />
                    Hold
                </Button>
                </>
            ) : (
                <span className="text-sm text-gray-500 italic">Select rows to perform bulk actions</span>
            )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <Checkbox
                  checked={isAllSelected}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSelectAll(e.target.checked)
                  }
                  aria-label="Select all rows"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University / Program</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Term</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Received</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending / On Hold</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((stipend) => (
              <StipendTrackingRow
                key={stipend.id}
                stipend={stipend}
                onUpdate={() => handleOpenModal(stipend)}
                isSelected={selectedStipendIds.includes(stipend.id)}
                onSelect={() => handleSelectOne(stipend.id)}
              />
            ))}
            {paginatedData.length === 0 && (
                <tr>
                    <td colSpan={9} className="text-center py-8 text-sm text-gray-500">
                        No stipend records found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 border-t">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing {filteredData.length > 0 ? startItem : 0}-{endItem} of {filteredData.length} records
        </p>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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

      {bulkAction && (
        <BulkStipendActionModal
          isOpen={!!bulkAction}
          onClose={() => setBulkAction(null)}
          onConfirm={handleBulkActionInitiate}
          action={bulkAction}
          pendingAllowances={uniquePendingAllowances}
          selectedCount={selectedCount}
          isLoading={false}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleBulkActionExecute}
        title={pendingPayload?.adminNote ? "Confirm Hold Status" : "Confirm Release"}
        description={
            pendingPayload?.adminNote 
            ? `Are you sure you want to place ${selectedCount} scholar(s) on hold? This will prevent them from receiving funds until resolved.`
            : `Are you sure you want to release allowances for ${selectedCount} scholar(s)? This action cannot be undone immediately.`
        }
        confirmText={pendingPayload?.adminNote ? "Yes, Place on Hold" : "Yes, Release Funds"}
        variant={pendingPayload?.adminNote ? "warning" : "info"}
        isLoading={isSubmitting}
      />
    </>
  );
}