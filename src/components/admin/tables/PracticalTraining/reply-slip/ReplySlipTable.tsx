import { useState, useEffect } from "react";
import ReplySlipRow from "./ReplySlipRow";
import { ReferralLetterModal } from "./ReferralLetterModal";
import {Pagination} from "@/components/shared/Pagination";

const MOCK_DATA = [
  {
    name: "Andrea Villanueva",
    type: "RA 7687",
    university: "Cavite State University - Indang",
    year: 2025,
    status: "approved",
    plan: "I will undertake 2025 PT Program",
  },
  {
    name: "Jericho Dela Cruz",
    type: "Merit",
    university: "University of the Philippines - Los Baños",
    year: 2025,
    status: "pending",
    plan: "I cannot participate in the program",
  },
  {
    name: "Aldrich Arenas",
    type: "RA 7687",
    university: "Batangas State University - Main",
    year: 2025,
    status: "approved",
    plan: "I have required OJT during the summer term",
  },
];

interface ReplySlipTableProps {
  filters: {
    year: string;
    status: string;
    plan: string;
    search: string;
  };
  setFilters: (value: any) => void;
}

export default function ReplySlipTable({ filters, setFilters }: ReplySlipTableProps) {
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setPage(1);
  }, [filters.search]);

  const filtered = MOCK_DATA.filter((r) =>
    filters.search
      ? r.name.toLowerCase().includes(filters.search.toLowerCase())
      : true
  );

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
        dateSubmitted: "N/A",
        plan: row.plan,
        replySlip: "reply-slip.pdf",
        curriculum: "curriculum.pdf",
      },
    };

    setSelectedRow(modalData);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white shadow-md rounded-lg mt-6">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-bold text-gray-800">Referral Letter</h2>

        <input
          type="text"
          placeholder="Search scholar..."
          className="border rounded-lg px-3 py-2 w-64"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="border-b hover:bg-gray-50 cursor-default">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Scholar</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">University</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Training Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Plan</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
                {paginated.map((row, i) => (
                    <ReplySlipRow
                    key={i}
                    row={{
                        index: i + 1 + (page - 1) * pageSize,
                        name: row.name,
                        type: row.type,
                        university: row.university,
                        year: row.year,
                        status: row.status,
                        plan: row.plan,
                    }}
                    onView={() => handleOpenModal(row)}
                    />
                ))}
                </tbody>


        </table>
      </div>
          
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">

                <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left cursor-default">
                    Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}
                    –
                    {Math.min(page * pageSize, filtered.length)} of {filtered.length} Reply Slips
                </p>


      <Pagination
        currentPage={page}
        totalPages={Math.ceil(filtered.length / pageSize)}
        onPageChange={setPage}
      />
            </div>


      <ReferralLetterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedRow}
      />
    </div>
  );
}
