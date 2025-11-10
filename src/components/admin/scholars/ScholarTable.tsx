'use client';

import { ScholarRow } from './ScholarRow';
import { Pagination } from '@/components/shared/Pagination';
import type { ScholarStatus } from '@/types/scholar';
import { Button } from '@/components/ui/button'; // <-- ADDED
import { Download} from 'lucide-react'; // <-- ADDED

// (ScholarRowData interface remains the same)
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
  profileImage: string;
}

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
              <ScholarRow key={scholar.id} scholar={scholar} />
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODIFIED: Pagination and Export layout --- */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing {startItem}-{endItem} of {totalScholars} scholars
        </p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="sm:justify-self-center" // <-- Center pagination
        />
        <div className="flex sm:justify-end"> {/* <-- Right-align export */}
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
    </>
  );
}