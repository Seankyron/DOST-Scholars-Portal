"use client";

import { useState } from "react";
import TravelClearanceCard from "./TravelClearanceCard";
import { Button } from "@/components/ui/button";
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

      {/* Pagination */}
      <div className="flex justify-center mt-6 items-center gap-3">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          &lt;
        </Button>

        <span className="px-4 py-1 border rounded">{page}</span>

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          &gt;
        </Button>
      </div>

      <p className="text-center mt-3 text-sm text-gray-500">
        Showing {paginated.length} of {data.length} travel clearance
      </p>
    </>
  );
}
