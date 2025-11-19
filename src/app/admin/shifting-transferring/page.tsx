"use client";

import { useState, useMemo } from "react";
import ShiftingFilters from "@/components/admin/shifting-transferring/ShiftingFilters";
import ShiftingTable from "@/components/admin/shifting-transferring/ShiftingTable";
import { ShiftingModal } from "@/components/admin/shifting-transferring/ShiftingModal";

type ShiftingData = {
  id: number;
  scholarName: string;
  type: string;
  currentUniversity: string;
  application: string;
  status: string;
  dateSubmitted: string;
};

const MOCK_DATA: ShiftingData[] = [
  {
    id: 1,
    scholarName: "Andrea Villanueva",
    type: "RA 7687",
    currentUniversity: "Cavite State University - Indang",
    application: "Shifting Course",
    status: "Pending",
    dateSubmitted: "2025-02-14",
  },
  {
    id: 2,
    scholarName: "Jericho Dela Cruz",
    type: "Merit",
    currentUniversity: "University of the Philippines - Los Baños",
    application: "Transferring School",
    status: "Approved",
    dateSubmitted: "2025-01-30",
  },
  {
    id: 3,
    scholarName: "Sean Kyron Briones",
    type: "RA 7687",
    currentUniversity: "Batangas State University - Main",
    application: "Shifting Course",
    status: "Pending",
    dateSubmitted: "2025-01-10",
  },
];

export default function ShiftingPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    application: "all",
    status: "all",
    from: "",
    to: "",
  });

  const [page, setPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pageSize = 10;

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      const matchesSearch =
        item.scholarName.toLowerCase().includes(search.toLowerCase()) ||
        item.currentUniversity.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filters.status === "all"
          ? true
          : item.status.toLowerCase() === filters.status;

      const matchesApplication =
        filters.application === "all"
          ? true
          : item.application.toLowerCase() === filters.application;

      const matchesDate =
        (!filters.from || item.dateSubmitted >= filters.from) &&
        (!filters.to || item.dateSubmitted <= filters.to);

      return matchesSearch && matchesStatus && matchesApplication && matchesDate;
    });
  }, [search, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  // Modal handler
  const handleView = (item: ShiftingData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Shifting / Transferring Management</h1>

      <ShiftingFilters filters={filters} setFilters={setFilters} />

      <ShiftingTable
        data={paginated}
        page={page}
        pageSize={pageSize}
        totalFiltered={filtered.length}
        totalPages={totalPages}
        onPageChange={setPage}
        search={search}
        setSearch={setSearch}
        onViewRow={handleView}
      />

      {selectedItem && (
        <ShiftingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedItem}
        />
      )}
    </div>
  );
}
