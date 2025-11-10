'use client';

import { useState } from 'react';
// --- MODIFICATION: Import component AND type from ScholarRow ---
import { ScholarRow, type ScholarRowData } from './ScholarRow';
import { Pagination } from '@/components/shared/Pagination';
import type { ScholarStatus } from '@/types/scholar';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ViewScholarModal } from './ViewScholarModal';
import { EditScholarModal } from './EditScholarModal';
import { HistoryScholarModal } from './HistoryScholarModal';
import { toast } from '@/components/ui/toaster';

// --- MODIFICATION: This entire duplicate interface has been removed to fix TS2440 ---
/*
export interface ScholarRowData {
  ...
}
*/

interface ScholarTableProps {
  scholars: ScholarRowData[];
  totalScholars: number;
  page: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
}

export function ScholarTable({
  scholars,
  totalScholars,
  page,
  itemsPerPage,
  onPageChange,
}: ScholarTableProps) {
  // (State and handlers remain the same)
  const [selectedScholar, setSelectedScholar] = useState<ScholarRowData | null>(
    null
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleView = (scholar: ScholarRowData) => {
    setSelectedScholar(scholar);
    setIsViewOpen(true);
  };

  const handleEdit = (scholar: ScholarRowData) => {
    setSelectedScholar(scholar);
    setIsEditOpen(true);
  };

  const handleHistory = (scholar: ScholarRowData) => {
    setSelectedScholar(scholar);
    setIsHistoryOpen(true);
  };

  const handleDelete = (scholar: ScholarRowData) => {
    setSelectedScholar(scholar);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedScholar) return;
    // In a real app, you'd call your API here
    console.log(`Deleting scholar: ${selectedScholar.name}`);
    toast.success(`${selectedScholar.name} has been deleted.`);
    setIsDeleteOpen(false);
    setSelectedScholar(null);
    // You would also refetch your scholars list here
  };

  const handleUpdate = (updatedScholar: ScholarRowData) => {
    if (!selectedScholar) return;
    // In a real app, you'd call your API here
    console.log(`Updating scholar: ${updatedScholar.name}`);
    toast.success(`${updatedScholar.name} has been updated.`);
    setIsEditOpen(false);
    setSelectedScholar(null);
    // You would also refetch your scholars list here
  };

  if (totalScholars === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No scholars found.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalScholars / itemsPerPage);
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalScholars);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* (Table headers remain the same) */}
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Scholar
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SPAS ID
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                University
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Year Level
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Course
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scholars.map((scholar) => (
              <ScholarRow
                key={scholar.id}
                scholar={scholar}
                onView={handleView}
                onEdit={handleEdit}
                onHistory={handleHistory}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing {startItem}-{endItem} of {totalScholars} scholars
        </p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="sm:justify-self-center"
        />
        <div className="flex sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Export logic not yet implemented.')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {selectedScholar && (
        <>
          {/* These will now work */}
          <ViewScholarModal
            open={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            scholar={selectedScholar}
          />

          <EditScholarModal
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            scholar={selectedScholar}
            onUpdate={handleUpdate}
          />

          <HistoryScholarModal
            open={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            scholar={selectedScholar}
          />

          <ConfirmDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDeleteConfirm}
            title="Delete Scholar"
            description={`Are you sure you want to delete ${selectedScholar.name}? This action cannot be undone.`}
            variant="danger"
            confirmText="Yes, delete scholar"
          />
        </>
      )}
    </>
  );
}