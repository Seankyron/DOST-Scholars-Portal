'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import router for refresh
import { AddScholarModal } from '@/components/admin/scholars/AddScholarModal';
import {
  ScholarFilters,
  type ScholarFiltersState,
} from '@/components/admin/scholars/ScholarFilter';
import { ScholarTable } from '@/components/admin/scholars/ScholarTable';
// --- FIX 1: Correct the import location for ScholarRowData ---
import { type ScholarRowData } from '@/components/admin/scholars/ScholarRow';
import { SearchInput } from '@/components/shared/SearchInput';
import { ViewScholarModal } from '@/components/admin/scholars/ViewScholarModal';
import { EditScholarModal } from '@/components/admin/scholars/EditScholarModal';

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

  // --- This page now only manages state that needs to be shared ---
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ScholarFiltersState>({
    scholarshipType: 'All',
    status: 'All',
    university: 'All',
    course: 'All',
    yearLevel: 'All',
  });

  // --- FIX 2: Add state for modal submission (replaces the old 'loading') ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for modals
  const [viewingScholar, setViewingScholar] = useState<ScholarRowData | null>(
    null
  );
  const [editingScholar, setEditingScholar] = useState<ScholarRowData | null>(
    null
  );
  // (Add state for Delete/History as needed)

  // --- All data-fetching (useEffect) logic is correctly GONE from this file ---

  // --- Handlers for state that this page owns ---
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

  // --- Handlers for actions coming UP from the table ---
  const handleView = (scholar: ScholarRowData) => setViewingScholar(scholar);
  const handleEdit = (scholar: ScholarRowData) => setEditingScholar(scholar);
  const handleHistory = (scholar: ScholarRowData) =>
    alert(`History for ${scholar.firstName}`); // Placeholder
  const handleDelete = (scholar: ScholarRowData) =>
    alert(`Deleting ${scholar.firstName}`); // Placeholder

  const handleCloseModals = () => {
    setViewingScholar(null);
    setEditingScholar(null);
  };

  // --- FIX 3: Update this function to use 'isSubmitting' and 'router.refresh()' ---
  const handleUpdateScholar = async (updatedData: ScholarRowData) => {
    setIsSubmitting(true); // Use the new state variable
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

      alert('Scholar updated successfully!');
      handleCloseModals();
      
      // This is the correct way to refresh the data.
      // It tells Next.js to re-run the server-side logic, which
      // will cause your ScholarTable to re-fetch with its useEffect.
      router.refresh(); 
      
      // --- REMOVED this block, as 'scholars' and 'setScholars' do not exist here ---
      // setScholars(
      //   scholars.map((s) => (s.id === updatedData.id ? updatedData : s))
      // );
      
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false); // Use the new state variable
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
        
        {/* ScholarTable fetches its own data, but we pass it
          the state it needs to build its query and handle events.
          The 'isSubmitting' state is NOT passed down, as the table
          has its own 'loading' state for fetching.
        */}
        <ScholarTable
          // --- Props to control the query ---
          filters={filters}
          searchTerm={searchTerm}
          page={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          
          // --- Handlers for events coming UP from the table ---
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
    </div>
  );
}