"use client";

import { useState } from "react";
import FeedbackTable from "@/components/admin/support-feedback/FeedbackTable";
import SupportFeedbackModal from "@/components/admin/support-feedback/FeedbackModal";

interface FeedbackItem {
  id: number;
  scholarName: string;
  yearSemester: string;
  academicYear: string;
  dateSubmitted: string;
  feedback: string;
  briefreason: string;
}

export default function FeedbackPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<FeedbackItem | null>(null);

  // Pagination + Search States
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [search, setSearch] = useState("");

  const sampleData: FeedbackItem[] = [
    {
      id: 1,
      scholarName: "Juan Dela Cruz",
      yearSemester: "1st Sem 2025",
      academicYear: "2025–2026",
      dateSubmitted: "2025-11-18",
      feedback: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      briefreason: "Lorem ipsum dolor sit amet.",
    },
  ];

  const filteredData = sampleData.filter((item) =>
    item.scholarName.toLowerCase().includes(search.toLowerCase())
  );

  const totalFiltered = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const openModal = (item: FeedbackItem) => {
    setSelected(item);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold cursor-default">
          Support & Feedback
        </h1>
      </div>

      <FeedbackTable
        data={paginatedData}
        page={page}
        pageSize={pageSize}
        totalFiltered={totalFiltered}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        search={search}
        setSearch={setSearch}
        onViewRow={openModal}
      />

      <SupportFeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={
          selected
            ? {
                scholarName: selected.scholarName,
                type: "JLSS Scholar",
                university: "Sample University",
                status: "Active",
                academicYear: selected.academicYear,
                semester: selected.yearSemester,
                dateSubmitted: selected.dateSubmitted,
                feedback: selected.feedback,
                briefreason: selected.briefreason,
              }
            : null
        }
      />
    </div>
  );
}
