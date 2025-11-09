'use client';

import { ScholarRow } from './ScholarRow';
import { Pagination } from '@/components/shared/Pagination';
import type { ScholarStatus } from '@/types/scholar';

// --- NEW: Export a data-shape interface for the parent ---
// This is the "View Model" that the parent page must provide.
export interface ScholarRowData {
  id: string;
  name: string;
  scholarId: string;
  scholarshipType: string;
  university: string;
  yearLevel: string;
  program: string;
  status: ScholarStatus;
  email: string;
  profileImage: string; // ScholarRow expects this in its prop type
}

// --- NEW: Props are simplified and controlled by parent ---
interface ScholarTableProps {
  scholars: ScholarRowData[]; // Data for *this page* only
  totalScholars: number; // Total count of *all* filtered items
  page: number; // The current page number
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
  // All fetching, filtering, and state logic has been removed.

  if (totalScholars === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No scholars found.</p>
        </div>
      </div>
    );
  }

  // Calculate pagination details
  const totalPages = Math.ceil(totalScholars / itemsPerPage);
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalScholars);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* --- Headers (no change) --- */}
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
              {/* Renders only the scholars it's given */}
              {scholars.map((scholar) => (
                <ScholarRow key={scholar.id} scholar={scholar} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* --- Pagination is now fully controlled --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
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