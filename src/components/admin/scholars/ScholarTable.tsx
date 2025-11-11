'use client';

// --- MODIFIED: Import the type from ScholarRow ---
import { ScholarRow, type ScholarRowData } from './ScholarRow';
import { Pagination } from '@/components/shared/Pagination';

interface ScholarTableProps {
  scholars: ScholarRowData[];
  totalScholars: number;
  page: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
  // --- NEW: Add props for actions ---
  onView: (scholar: ScholarRowData) => void;
  onEdit: (scholar: ScholarRowData) => void;
  onHistory: (scholar: ScholarRowData) => void;
  onDelete: (scholar: ScholarRowData) => void;
}

export function ScholarTable({
  scholars,
  totalScholars,
  page,
  itemsPerPage,
  onPageChange,
  // --- NEW: Accept action props ---
  onView,
  onEdit,
  onHistory,
  onDelete,
}: ScholarTableProps) {
  if (totalScholars === 0) {
    return (
      <div className="bg-white rounded-lg">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No scholars found.</p>
        </div>
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
            <tr>
              {/* --- Headers now match ScholarRowData --- */}
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
                // --- NEW: Pass handlers down ---
                onView={onView}
                onEdit={onEdit}
                onHistory={onHistory}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 p-4 border-t">
        <p className="text-sm text-gray-700">
          Showing {startItem}-{endItem} of {totalScholars} scholars
        </p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}