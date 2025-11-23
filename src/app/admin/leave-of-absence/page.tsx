"use client";

import { useState, useMemo } from "react";
import LeaveFilters from "@/components/admin/tables/LeaveOfAbsence/LeaveFilters";
import LeaveTable from "@/components/admin/tables/LeaveOfAbsence/LeaveTable";
import LeaveModal from "@/components/admin/tables/LeaveOfAbsence/LeaveModal";
import { LeaveData } from "@/types/leave";


const MOCK_DATA: LeaveData[] = [
  {
    id: 1,
    scholarName: "Andrea Villanueva",
    type: "RA 7687",
    university: "Cavite State University - Indang",
    reason: "Medical",
    status: "Pending",
    dateSubmitted: "2025-02-14",
    academicYear: "2024–2025",
    semester: "1st Sem",
    remarks: "Hospital confinement"
  },
  {
    id: 2,
    scholarName: "Jericho Dela Cruz",
    type: "Merit",
    university: "University of the Philippines - Los Baños",
    reason: "Personal",
    status: "Approved",
    dateSubmitted: "2025-01-22",
    academicYear: "2023–2024",
    semester: "2nd Sem",
    remarks: "Family emergency"
  },
  {
    id: 3,
    scholarName: "Sean Kyron Briones",
    type: "RA 7687",
    university: "Batangas State University - Main",
    reason: "Medical",
    status: "Pending",
    dateSubmitted: "2025-01-10",
    academicYear: "2023–2024",
    semester: "Midyear",
    remarks: "Surgery recovery"
  }
];

export default function LeaveOfAbsencePage() {
  const [selected, setSelected] = useState<LeaveData | null>(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    reason: "all",
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

      const matchesReason =
        filters.reason === "all"
          ? true
          : item.reason.toLowerCase() === filters.reason;

      const matchesStatus =
        filters.status === "all"
          ? true
          : item.status.toLowerCase() === filters.status;

      const matchesDate =
        (!filters.from || item.dateSubmitted >= filters.from) &&
        (!filters.to || item.dateSubmitted <= filters.to);

      return matchesSearch && matchesReason && matchesStatus && matchesDate;
    });
  }, [search, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Leave of Absence Management</h1>

      <LeaveFilters filters={filters} setFilters={setFilters} />

      <LeaveTable
        data={paginated}
        page={page}
        pageSize={pageSize}
        totalFiltered={filtered.length}
        totalPages={totalPages}
        onPageChange={setPage}
        search={search}
        setSearch={setSearch}
        onViewRow={(item: LeaveData) => {
          setSelected(item);
          setOpen(true);
        }}
      />

      <LeaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        data={selected}
      />
    </div>
  );
}
