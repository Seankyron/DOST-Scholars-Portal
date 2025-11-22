import { Eye } from "lucide-react";

export default function FeedbackRow({ item, onView }: any) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 cursor-default">{item.scholarName}</td>
      <td className="p-3 cursor-default">{item.yearSemester}</td>
      <td className="p-3 cursor-default">{item.academicYear}</td>
      <td className="p-3 cursor-default">{item.dateSubmitted}</td>

      <td className="p-3 text-right">
        <button
          onClick={() => onView(item)}
          className="inline-flex items-center justify-center p-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
