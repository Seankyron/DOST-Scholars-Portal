"use client";

import { useState, useMemo } from "react";
import RequestFilters from "@/components/admin/request-forms/RequestFilters";
import RequestTable from "@/components/admin/request-forms/RequestTable";
import RequestFormModal from "@/components/admin/request-forms/RequestModal";

export default function RequestFormPage() {
  const MOCK_REQUESTS = [
    {
      id: 1,
      scholarName: "Andrea Villanueva",
      type: "RA 7687",
      university: "Cavite State University",
      requestForm: "Lorem ip...",
      status: "Pending",
      dateSubmitted: "2025-02-14",
    },
    {
    id: 1,
    scholarName: "Andrea Villanueva",
    type: "RA 7687",
    university: "Cavite State University - Indang",
    requestForm: "Lorem ip...",
    status: "Pending",
    dateSubmitted: "2025-02-14",
    }
  ];

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    form: "all",
    status: "all",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return MOCK_REQUESTS.filter((item) => {
      const searchLower = search.toLowerCase();

      const matchesSearch =
        item.scholarName.toLowerCase().includes(searchLower) ||
        item.university.toLowerCase().includes(searchLower);

      const matchesForm =
        filters.form === "all"
          ? true
          : item.requestForm.toLowerCase() === filters.form;

      const matchesStatus =
        filters.status === "all"
          ? true
          : item.status.toLowerCase() === filters.status;

      return matchesSearch && matchesForm && matchesStatus;
    });
  }, [search, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Request Form Management</h1>

      <RequestFilters filters={filters} setFilters={setFilters} />

      <RequestTable
        data={paginated}
        page={page}
        pageSize={pageSize}
        totalFiltered={filtered.length}
        totalPages={totalPages}
        onPageChange={setPage}
        search={search}
        setSearch={setSearch}
        onViewRow={(item: any) => {
          setSelected(item);
          setOpen(true);
        }}
      />

        <RequestFormModal
                isOpen={open}
                onClose={() => setOpen(false)}
                data={selected}
              />
    </div>
  );
}
