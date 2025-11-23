"use client";

import { useMemo, useState } from "react";
import ThesisAllowanceFilters from "@/components/admin/tables/ThesisAllowance/ThesisAllowanceFilters";
import ThesisAllowanceTable from "@/components/admin/tables/ThesisAllowance/ThesisAllowanceTable";
import { ThesisAllowanceModal } from "@/components/admin/tables/ThesisAllowance/ThesisAllowanceModal";
import type { ThesisAllowance } from "@/types/ThesisAllowance";

const MOCK_DATA: ThesisAllowance[] = [
  {
    id: 1,
    scholarName: "Juan Dela Cruz",
    school: "UP Diliman",
    course: "BS Computer Science",
    status: "Approved",
    percentage: "100%",
    submittedDate: "2025-01-10",
  },
  {
    id: 2,
    scholarName: "Maria Santos",
    school: "PUP Manila",
    course: "BS Information Technology",
    status: "Pending",
    percentage: "50%",
    submittedDate: "2025-01-12",
  },
];

export default function ThesisAllowancePage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    percentage: "all",
    status: "all",
    from: "",
    to: "",
  });

  const [page, setPage] = useState(1);

  // modal state
  const [selectedData, setSelectedData] = useState<any>(null);
  const [selectedPercentage, setSelectedPercentage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pageSize = 10;

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      const matchesSearch =
        item.scholarName.toLowerCase().includes(search.toLowerCase()) ||
        item.school.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filters.status === "all" ? true : item.status.toLowerCase() === filters.status;

      const matchesPercentage =
        filters.percentage === "all" ? true : item.percentage === `${filters.percentage}%`;

      const matchesDate =
        (!filters.from || item.submittedDate >= filters.from) &&
        (!filters.to || item.submittedDate <= filters.to);

      return matchesSearch && matchesStatus && matchesPercentage && matchesDate;
    });
  }, [search, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  // open modal — construct modal-ready data (you can swap with real backend data)
  const handleView = (item: ThesisAllowance) => {
    setSelectedData({
      scholarInfo: {
        name: item.scholarName,
        contactNumber: "09123456789",
        dateOfBirth: "2000-01-01",
        completeAddress: "123 Sample St., Brgy. Example, City",
      },
      placementInfo: {
        scholarshipType: "Merit",
        batch: "2020",
        university: item.school,
        program: item.course,
      },
      submissionInfo: {
        yearSemester: "1st Sem",
        academicYear: "2024-2025",
        dateSubmitted: item.submittedDate,
      },
      files: {
        registrationForm: "reg_form.pdf",
        thesisProposal: "thesis_proposal.pdf",
        approvalSheet: "approval_sheet.pdf",
      },
    });

    // strip trailing % to keep modal title rendering consistent (we add % in modal)
    setSelectedPercentage(item.percentage.replace("%", ""));
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Thesis Allowance Management</h1>

      <ThesisAllowanceFilters filters={filters} setFilters={setFilters} />

      <ThesisAllowanceTable
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

      {selectedData && selectedPercentage !== null && (
        <ThesisAllowanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          percentage={selectedPercentage}
          data={selectedData}
        />
      )}
    </div>
  );
}
