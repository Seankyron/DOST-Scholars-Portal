import ThesisAllowanceRow from "./ThesisAllowanceRow";
import { Pagination } from "@/components/shared/Pagination";
import type { ThesisAllowance } from "@/types/ThesisAllowance";


export default function ThesisAllowanceTable({
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

      {/* Title + Search */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Thesis Allowance</h3>

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
              <th className="p-3"></th>
              <th className="p-3 text-left">Scholar</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">University</th>
              <th className="p-3 text-left">Percentage</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date Submitted</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
    {data.map((item: ThesisAllowance, i: number) => (
    <ThesisAllowanceRow
      key={i}
      row={{
        scholar: item.scholarName,
        type: item.course,        
        university: item.school,
        percentage: item.percentage.replace("%", ""),
        status: item.status.toLowerCase(),
        dateSubmitted: item.submittedDate
      }}
        onView={() => onViewRow(item)}     />
  ))}
</tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 text-sm text-gray-700 px-1">
  <div className="flex justify-between items-center">
    <p className="w-1/3">
      Showing {data.length === 0 ? 0 : (page - 1) * pageSize + 1}–
      {(page - 1) * pageSize + data.length} of {totalFiltered} Thesis Allowance responses
    </p>

    <div className="w-1/3 flex justify-center">
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>

    <div className="w-1/3"></div>
  </div>
</div>


    </div>
  );
}
