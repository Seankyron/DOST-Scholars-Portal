import FeedbackRow from "./FeedbackRow";
import { Pagination } from "@/components/shared/Pagination";

interface FeedbackTableProps {
  data: any[];
  page: number;
  pageSize: number;
  totalFiltered: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  search: string;
  setSearch: (value: string) => void;
  onViewRow: (item: any) => void;
}

export default function FeedbackTable({
  data,
  page,
  pageSize,
  totalFiltered,
  totalPages,
  onPageChange,
  search,
  setSearch,
  onViewRow,
}: FeedbackTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden p-3">
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Support & Feedback</h3>

        <input
          type="text"
          placeholder="Search Scholars..."
          className="border rounded-md px-3 py-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr className="border-b hover:bg-gray-50 cursor-default">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Scholar Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Year & Semester</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Academic Year</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date Submitted</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No feedback found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <FeedbackRow
                key={item.id}
                item={item}
                onView={() => onViewRow(item)}
              />
            ))
          )}
        </tbody>
      </table>

        <div className="mt-3 text-sm text-gray-700 px-1">
        <div className="flex justify-between items-center cursor-default">
            <p className="w-1/3">
            Showing {data.length === 0 ? 0 : (page - 1) * pageSize + 1}–
            {(page - 1) * pageSize + data.length} of {totalFiltered} feedback responses
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
