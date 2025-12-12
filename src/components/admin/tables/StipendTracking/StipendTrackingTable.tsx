// seankyron/dost-scholars-portal/DOST-Scholars-Portal-merge/src/components/admin/tables/StipendTracking/StipendTrackingTable.tsx

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Pagination } from '@/components/shared/Pagination';
import type {
  SubmissionStatus,
  YearLevel,
  Semester,
  Allowance,
  ScholarStatus,
  Province,
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
import type { StipendFiltersState } from './StipendTrackingFilters';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';

// --- Types ---
export type ScholarStipendData = {
  received: number;
  pending: number; // Maps to 'unreleased' in DB
  onHold: boolean;
  total: number;
  status: SubmissionStatus | ScholarStatus;
  breakdown: Allowance[];
  updates: StipendUpdate[];
  effectiveDate: string;
};

export interface StipendDetails {
  id: string; // The numeric ID from DB converted to string
  scholarInfo: {
    id: string; // spas_id
    name: string;
    scholarId: string; // spas_id
    email: string;
    contactNumber: string;
    scholarshipType: string;
    batch: string;
    province: Province;
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

const ITEMS_PER_PAGE = 7;

interface StipendTrackingTableProps {
  searchTerm: string;
  filters: StipendFiltersState;
}

export function StipendTrackingTable({ searchTerm, filters }: StipendTrackingTableProps) {
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
      const response = await fetch('/api/admin/stipend-tracking/get');
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to fetch');

      // Map Database View (Flat) to Frontend Interface (Nested)
      const mappedData: StipendDetails[] = result.stipends.map((item: any) => {
        const breakdown = (item.allowance_breakdown as Allowance[]) || [];
        
        return {
          id: item.id.toString(),
          scholarInfo: {
            id: item.spas_id,
            name: item.full_name || 'Unknown',
            scholarId: item.spas_id || 'N/A',
            email: item.email || '',
            contactNumber: item.contact_number || '',
            scholarshipType: item.scholarship_type || 'N/A',
            batch: item.year_awarded || 'N/A',
            province: (item.province as Province) || 'Metro Manila',
          },
          placementInfo: {
            university: item.university || 'N/A',
            program: item.program_course || 'N/A',
          },
          semesterInfo: {
            year: `${item.year_level || 1}th Year` as YearLevel,
            semester: item.semester as Semester,
            academicYear: item.academic_year || 'N/A', 
          },
          stipend: {
            received: item.received || 0,
            pending: item.unreleased || 0,
            onHold: item.status === 'On hold',
            total: (item.received || 0) + (item.unreleased || 0),
            status: item.status,
            effectiveDate: item.updated_at,
            breakdown: breakdown,
            updates: [], // Logic for updates can be added if a separate table/column exists
          },
        };
      });

      setStipends(mappedData);
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

    return stipends.filter((s) => {
      // 1. Search Term (Name)
      const matchesSearch = s.scholarInfo.name.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Status
      const matchesStatus = 
        filters.status === 'All' || s.stipend.status === filters.status;

      // 3. Academic Year
      const matchesAY = 
        filters.academicYear === 'All' || s.semesterInfo.academicYear === filters.academicYear;

      // 4. Semester
      const matchesSemester = 
        filters.semester === 'All' || s.semesterInfo.semester === filters.semester;

      // 5. University
      const matchesUniversity = 
        filters.university === 'All' || s.placementInfo.university === filters.university;

      // 6. Province
      const matchesProvince = 
        filters.province === 'All' || s.scholarInfo.province === filters.province;

      // 7. Date Range
      let matchesDate = true;
      if (filters.dateRange.start && filters.dateRange.end && s.stipend.effectiveDate) {
        const recordDate = new Date(s.stipend.effectiveDate);
        matchesDate = isWithinInterval(recordDate, {
          start: startOfDay(filters.dateRange.start),
          end: endOfDay(filters.dateRange.end),
        });
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAY &&
        matchesSemester &&
        matchesUniversity &&
        matchesProvince &&
        matchesDate
      );
    });
  }, [stipends, searchTerm, filters]);

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
        const actionType = pendingPayload.adminNote ? 'Hold' : 'Release';
        const newStatus: SubmissionStatus = actionType === 'Hold' ? 'On hold' : 'Released';
        
        // Loop through selected items and fire update requests
        const updatePromises = selectedStipendIds.map(async (id) => {
            const currentItem = stipends.find(s => s.id === id);
            if (!currentItem) return;

            const updatedBreakdown = currentItem.stipend.breakdown.map(b => ({
                ...b,
                status: actionType === 'Hold' ? 'On hold' : 'Released' as any
            }));

            // Recalculate totals
            const newReceived = updatedBreakdown
              .filter(i => i.status === 'Released')
              .reduce((sum, i) => sum + i.amount, 0);
            
            const newPending = updatedBreakdown
              .filter(i => i.status !== 'Released')
              .reduce((sum, i) => sum + i.amount, 0);

            const body = {
                id: Number(id),
                status: newStatus,
                received: newReceived,
                pending: newPending,
                breakdown: updatedBreakdown
            };

            await fetch('/api/admin/stipend-tracking/put', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
        });

        await Promise.all(updatePromises);

        if (actionType === 'Release') {
            toast.success(`Successfully released allowances for ${selectedStipendIds.length} scholar(s).`);
        } else {
            toast.warning(`Placed ${selectedStipendIds.length} stipend(s) on hold.`);
        }

        setIsConfirmOpen(false);
        setPendingPayload(null);
        setSelectedStipendIds([]);
        fetchData(); // Refresh UI with real data
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

  const handleSave = async (updatedStipend: StipendDetails) => {
    try {
      const body = {
        id: Number(updatedStipend.id),
        status: updatedStipend.stipend.status,
        received: updatedStipend.stipend.received,
        pending: updatedStipend.stipend.pending,
        breakdown: updatedStipend.stipend.breakdown,
      };

      const res = await fetch('/api/admin/stipend-tracking/put', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Update failed');
      }

      toast.success("Stipend record updated successfully.");
      handleCloseModal();
      fetchData(); // Refresh UI
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update stipend.");
    }
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
      <div className="bg-gray-50 px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 min-h-[50px]">
        <div className="flex items-center gap-2 flex-wrap">
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Province</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University / Program</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Term</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
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
                    <td colSpan={10} className="text-center py-8 text-sm text-gray-500">
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