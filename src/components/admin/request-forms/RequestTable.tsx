"use client";

import RequestRow from "./RequestRow";
import { Pagination } from "@/components/shared/Pagination";

export default function RequestTable({
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

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold cursor-default">Request Form Management</h3>

        <input
          type="text"
          placeholder="Search Scholars..."
          className="border rounded-md px-3 py-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
          <tr className="border-b hover:bg-gray-50 cursor-default">
            <th></th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Scholar</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">University</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Request Form</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date Submitted</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item: any, i: number) => (
              <RequestRow
                key={i}
                row={{
                  scholar: item.scholarName,
                  type: item.type,
                  university: item.university,
                  requestForm: item.requestForm,
                  status: item.status,
                  date: item.dateSubmitted,
                }}
                onView={() => onViewRow(item)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-sm text-gray-700 px-1">
        <div className="flex justify-between items-center cursor-default">
          <p>
            Showing {data.length === 0 ? 0 : (page - 1) * pageSize + 1}–
            {(page - 1) * pageSize + data.length} of {totalFiltered} Request Forms responses
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
