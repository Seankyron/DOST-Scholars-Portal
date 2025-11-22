"use client";

import { useState } from "react";
import TravelClearanceCard from "./TravelClearanceCard";
import { Pagination } from "@/components/shared/Pagination";
import type { TravelClearance } from "@/app/admin/travel-clearance/page";

interface Props {
  data: TravelClearance[];
  onView: (item: TravelClearance) => void;
}

export default function TravelClearanceList({ data, onView }: Props) {
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginated = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginated.map((item) => (
          <TravelClearanceCard key={item.id} item={item} onView={onView} />
        ))}
      </div>

        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left mt-4">
            Showing {(page - 1) * itemsPerPage + 1} –
            {Math.min(page * itemsPerPage, data.length)} of {data.length} Travel Clearances
        </p>


      <div className="mt-6 flex justify-center cursor-default">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
