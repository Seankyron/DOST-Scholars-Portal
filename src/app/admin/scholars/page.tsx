'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddScholarModal } from '@/components/admin/scholars/AddScholarModal';
import {
  ScholarFilters,
  type ScholarFiltersState,
} from '@/components/admin/scholars/ScholarFilter';
import { ScholarTable } from '@/components/admin/scholars/ScholarTable';
import { type ScholarRowData } from '@/components/admin/scholars/ScholarRow';
import { SearchInput } from '@/components/shared/SearchInput';
import { ViewScholarModal } from '@/components/admin/scholars/ViewScholarModal';
import { EditScholarModal } from '@/components/admin/scholars/EditScholarModal';
import { HistoryScholarModal } from '@/components/admin/scholars/HistoryScholarModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';

// (Helper functions: getYearLevelNumber)
const getYearLevelNumber = (yearString: string): number | null => {
  if (yearString === '1st Year') return 1;
  if (yearString === '2nd Year') return 2;
  if (yearString === '3rd Year') return 3;
  if (yearString === '4th Year') return 4;
  if (yearString === 'Graduated') return 5;
  return null;
};

const ITEMS_PER_PAGE = 7;

export default function ScholarManagementPage() {
  const router = useRouter(); // For refreshing data

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ScholarFiltersState>({
    scholarshipType: 'All',
    status: 'All',
    university: 'All',
    course: 'All',
    yearLevel: 'All',
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for modals
  const [viewingScholar, setViewingScholar] = useState<ScholarRowData | null>(
    null
  );
  const [editingScholar, setEditingScholar] = useState<ScholarRowData | null>(
    null
  );
  const [historyScholar, setHistoryScholar] = useState<ScholarRowData | null>(
    null
  );
  const [deletingScholar, setDeletingScholar] = useState<ScholarRowData | null>(
    null
  );
  // --- END ADDED STATE ---

  const handleFilterChange = (
    filterName: keyof ScholarFiltersState,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); // Reset page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1); // Reset page when search changes
  };

  const handleView = (scholar: ScholarRowData) => setViewingScholar(scholar);
  const handleEdit = (scholar: ScholarRowData) => setEditingScholar(scholar);
  const handleHistory = (scholar: ScholarRowData) => setHistoryScholar(scholar);
  const handleDelete = (scholar: ScholarRowData) => setDeletingScholar(scholar);

  const handleCloseModals = () => {
    setViewingScholar(null);
    setEditingScholar(null);
    setHistoryScholar(null); // MODIFIED
    setDeletingScholar(null); // MODIFIED
  };

  const handleUpdateScholar = async (updatedData: ScholarRowData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/update-scholar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update scholar');
      }

      toast.success('Scholar updated successfully!');
      handleCloseModals();
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingScholar) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/delete-scholar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingScholar.id }), // Send only the ID
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete scholar');
      }

      toast.success('Scholar deleted successfully!');
      handleCloseModals();
      router.refresh(); // Refresh the table data
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Scholar Management
      </h1>

      {/* Filters are controlled by this page */}
      <ScholarFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Scholars
            </h2>
            <AddScholarModal />
          </div>

          <SearchInput
            placeholder="Search Scholars...."
            onSearch={handleSearch}
            className="w-full sm:max-w-xs"
          />
        </div>

        {/* ScholarTable passes all event handlers down */}
        <ScholarTable
          filters={filters}
          searchTerm={searchTerm}
          page={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          refreshKey={refreshKey}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onHistory={handleHistory}
          onDelete={handleDelete}
        />
      </div>

      {/* Modals are still rendered here, controlled by this page's state */}
      {viewingScholar && (
        <ViewScholarModal
          scholar={viewingScholar}
          open={!!viewingScholar}
          onClose={handleCloseModals}
        />
      )}

      {editingScholar && (
        <EditScholarModal
          scholar={editingScholar}
          open={!!editingScholar}
          onClose={handleCloseModals}
          onUpdate={handleUpdateScholar}
        />
      )}

      {/* --- 5. ADDED MODALS --- */}
      {historyScholar && (
        <HistoryScholarModal
          scholar={historyScholar}
          open={!!historyScholar}
          onClose={handleCloseModals}
        />
      )}

      {deletingScholar && (
        <ConfirmDialog
          isOpen={!!deletingScholar}
          onClose={handleCloseModals}
          onConfirm={handleConfirmDelete}
          title="Delete Scholar"
          description={`Are you sure you want to permanently delete ${deletingScholar.firstName} ${deletingScholar.surname}? This action will delete their account and all associated data. This cannot be undone.`}
          variant="danger"
          confirmText="Yes, delete scholar"
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}