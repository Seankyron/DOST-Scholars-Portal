"use client";

import LeaveRow from "./LeaveRow";
import { Pagination } from "@/components/shared/Pagination";

export default function LeaveTable({
  data,
  page,
  pageSize,
  totalFiltered,
  totalPages,
  onPageChange,
  search,
  setSearch,
  onViewRow,
}: any) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">

]      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Leave of Absence</h3>

        <input
          type="text"
          placeholder="Search Scholars..."
          className="border rounded-md px-3 py-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Scholar</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">University</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date Submitted</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item: any, i: number) => (
              <LeaveRow
                key={i}
                row={{
                  scholar: item.scholarName,
                  type: item.type,
                  university: item.university,
                  reason: item.reason,    
                  status: item.status,
                  date: item.dateSubmitted,
                }}
                onView={() => onViewRow(item)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 text-sm text-gray-700 px-1">
        <div className="flex justify-between items-center">
          <p>
            Showing {data.length === 0 ? 0 : (page - 1) * pageSize + 1}–
            {(page - 1) * pageSize + data.length} of {totalFiltered} Leave requests
          </p>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />

          <div className="w-1/3"></div>
        </div>
      </div>

    </div>
  );
}
