import StatusBadge from '../badges/StatusBadge';
import TypeBadge from '../badges/TypeBadge';
import { Eye, Check, X } from 'lucide-react';

export default function PTPCompletionRow({ row, onView }: any) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 cursor-pointer">
        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
      </td>

      <td className="p-3 cursor-default">{row.name}</td>
      <td className="p-3 cursor-default">
        <TypeBadge type={row.type} />
      </td>

      <td className="p-3 cursor-default">{row.university}</td>
      <td className="p-3 cursor-default">{row.year}</td>
      <td className="p-3 cursor-default">
        <StatusBadge status={row.status} />
      </td>
      <td className="p-3 cursor-default">{row.plan}</td>

      <td className="p-3 flex gap-2">
        <button onClick={onView} className="flex items-center justify-center p-1 border border-blue-500 rounded hover:bg-blue-50">
          <Eye className="text-blue-600 w-4 h-4" />
        </button>

        <button className="flex items-center justify-center p-1 border border-blue-500 rounded hover:bg-blue-50">
          <Check className="text-green-600 w-4 h-4" />
        </button>
        <button className="flex items-center justify-center p-1 border border-blue-500 rounded hover:bg-blue-50">
          <X className="text-red-600 w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
