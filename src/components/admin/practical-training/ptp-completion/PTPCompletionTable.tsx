"use client";

import { useState, useEffect } from "react";
import PTPCompletionRow from "./PTPCompletionRow";
import CompletionModal from "./CompletionModal";
import {Pagination} from "@/components/shared/Pagination";

const MOCK_DATA = [
  {
    name: "Andrea Villanueva",
    type: "RA 7687",
    university: "Cavite State University - Indang",
    year: 2025,
    status: "completed",
    plan: "Completed as scheduled",
    completionDate: "2025-03-15",
    files: {
      dtr: "dtr-andrea.pdf",
      form126: "form126-andrea.pdf",
      form127: "form127-andrea.pdf",
      form128: "form128-andrea.pdf",
    },
  },
  {
    name: "Jericho Dela Cruz",
    type: "Merit",
    university: "University of the Philippines - Los Baños",
    year: 2025,
    status: "pending",
    plan: "Pending completion",
    completionDate: null,
    files: {
      dtr: "dtr-jericho.pdf",
      form126: "form126-jericho.pdf",
      form127: "form127-jericho.pdf",
      form128: "form128-jericho.pdf",
    },
  },
];

interface PTPCompletionTableProps {
  filters: {
    year: string;
    status: string;
    plan: string;
    search: string;
  };
  setFilters: (f: any) => void;
}

export default function PTPCompletionTable({ filters, setFilters }: PTPCompletionTableProps) {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setPage(1);
  }, [filters.search]);

  const filtered = MOCK_DATA.filter((r) => {
    if (filters.year !== "all" && String(r.year) !== filters.year) return false;
    if (filters.status !== "all" && r.status !== filters.status) return false;
    if (filters.search && !r.name.toLowerCase().includes(filters.search.toLowerCase()))
      return false;
    return true;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleOpenModal = (row: any) => {
    const modalData = {
      scholarInfo: {
        name: row.name,
        contact: "N/A",
        dob: "N/A",
        address: "N/A",
      },
      placement: {
        scholarshipType: row.type,
        batch: "2025",
        university: row.university,
        program: "Undeclared",
      },
      submission: {
        yearSem: "1st Sem",
        academicYear: "2024–2025",
        dateSubmitted: row.completionDate || "N/A",
        plan: row.plan,
        dtr: row.files?.dtr,
        form126: row.files?.form126,
        form127: row.files?.form127,
        form128: row.files?.form128,
      },
    };

    setSelectedRow(modalData);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white shadow-md rounded-lg mt-6">
      {/* Title + Search */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-bold text-gray-800">Practical Training Program Completion</h2>

        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-3 py-2 w-64"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th></th>
              <th>Scholar</th>
              <th>Type</th>
              <th>University</th>
              <th>Training Year</th>
              <th>Status</th>
              <th>Plan</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((row, i) => (
                        <PTPCompletionRow
                            key={i}
                            row={row}
                            onView={() => handleOpenModal(row)}
                        />
                        ))}
            
          </tbody>
        </table>
      </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">

        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
        Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}
        –
        {Math.min(page * pageSize, filtered.length)} of {filtered.length} PTP Completion responses
        </p>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(filtered.length / pageSize)}
        onPageChange={setPage}
      />

      </div>

      {/* Modal */}
      <CompletionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedRow}
      />
    </div>
  );
}
