'use client';

import { useState } from 'react';
// --- All data-fetching imports are removed ---
import { AddScholarModal } from '@/components/admin/scholars/AddScholarModal';
import {
  ScholarFilters,
  type ScholarFiltersState,
} from '@/components/admin/scholars/ScholarFilter';
import {
  ScholarTable,
  type ScholarRowData, // We still need the type for modal state
} from '@/components/admin/scholars/ScholarTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { ViewScholarModal } from '@/components/admin/scholars/ViewScholarModal';
import { EditScholarModal } from '@/components/admin/scholars/EditScholarModal';


export default function ScholarManagementPage() {
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

  // --- State for modals is kept here, so it can be passed to the table ---
  const [viewingScholar, setViewingScholar] = useState<ScholarRowData | null>(
    null
  );
  // --- NEW: State for Edit Modal ---
  const [editingScholar, setEditingScholar] = useState<ScholarRowData | null>(
    null
  );


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
  const handleEdit = (scholar: ScholarRowData) => alert(`Editing ${scholar.firstName}`);
  const handleHistory = (scholar: ScholarRowData) => alert(`History for ${scholar.firstName}`);
  const handleDelete = (scholar: ScholarRowData) => alert(`Deleting ${scholar.firstName}`);
  const handleCloseModals = () => {
    setViewingScholar(null);
  };

  const ITEMS_PER_PAGE = 7;
  
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
      {/* --- NEW: Render the Edit Modal --- */}
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