"use client";

import { useState, useMemo } from "react";
import ReimbursementFilters from "@/components/admin/reimbursement/ReimbursementFilters";
import ReimbursementTable from "@/components/admin/reimbursement/ReimbursementTable";
import ReimbursementModal from "@/components/admin/reimbursement/ReimbursementModal";

type ReimbursementData = {
  id: number;
  scholarName: string;
  type: string;
  university: string;
  reimbursement: string;
  status: string;
  dateSubmitted: string;

  yearSem: string;
  academicYear: string;
  program: string;
  reimbursementType: string;
  reason: string;
  receipt: string;
};

const MOCK_DATA: ReimbursementData[] = [
  {
    id: 1,
    scholarName: "Andrea Villanueva",
    type: "RA 7687",
    university: "Cavite State University - Indang",
    reimbursement: "Lorem ip...",
    status: "Pending",
    dateSubmitted: "2025-02-14",

    yearSem: "1st Sem",
    academicYear: "2024–2025",
    program: "BS Computer Science",
    reimbursementType: "Transportation",
    reason: "Attended required seminar",
    receipt: "receipt1.pdf",
  },
  {
    id: 2,
    scholarName: "Jericho Dela Cruz",
    type: "Merit",
    university: "University of the Philippines - Los Baños",
    reimbursement: "Lorem ip...",
    status: "Approved",
    dateSubmitted: "2025-01-30",

    yearSem: "2nd Sem",
    academicYear: "2023–2024",
    program: "BS Biology",
    reimbursementType: "Medical",
    reason: "Medical check-up",
    receipt: "receipt2.pdf",
  },
  {
    id: 3,
    scholarName: "Sean Kyron Briones",
    type: "RA 7687",
    university: "Batangas State University - Main",
    reimbursement: "Lorem ip...",
    status: "Pending",
    dateSubmitted: "2025-01-10",

    yearSem: "Midyear",
    academicYear: "2023–2024",
    program: "BS Computer Science",
    reimbursementType: "Thesis",
    reason: "Thesis printing reimbursement",
    receipt: "receipt3.pdf",
  },
];

export default function ReimbursementPage() {
  const [selected, setSelected] = useState<ReimbursementData | null>(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    from: "",
    to: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      const searchLower = search.toLowerCase();

      const matchesSearch =
        item.scholarName.toLowerCase().includes(searchLower) ||
        item.university.toLowerCase().includes(searchLower);

      const matchesStatus =
        filters.status === "all"
          ? true
          : item.status.toLowerCase() === filters.status;

      const matchesType =
        filters.type === "all"
          ? true
          : item.type.toLowerCase() === filters.type;

      const matchesDate =
        (!filters.from || item.dateSubmitted >= filters.from) &&
        (!filters.to || item.dateSubmitted <= filters.to);

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [search, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Reimbursement Management</h1>

      <ReimbursementFilters filters={filters} setFilters={setFilters} />

      <ReimbursementTable
        data={paginated}
        page={page}
        pageSize={pageSize}
        totalFiltered={filtered.length}
        totalPages={totalPages}
        onPageChange={setPage}
        search={search}
        setSearch={setSearch}
        onViewRow={(item: ReimbursementData) => {
          setSelected(item);
          setOpen(true);
        }}
      />

      <ReimbursementModal
        isOpen={open}
        onClose={() => setOpen(false)}
        data={selected}
      />
    </div>
  );
}
