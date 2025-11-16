import StatusBadge from './StatusBadge';
import { Eye, Check, X } from 'lucide-react';

export default function ReplySlipRow({ row, onView }: any) {
    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="p-3">
                <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            </td>

            <td className="p-3">{row.name}</td>
            <td className="p-3">
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                    {row.type}
                </span>
            </td>

            <td className="p-3">{row.university}</td>
            <td className="p-3">{row.year}</td>
            <td className="p-3">
                <StatusBadge status={row.status} />
            </td>
            <td className="p-3">{row.plan}</td>

            <td className="p-3 flex gap-2">

                {/* VIEW button (open modal) */}
                <button 
                    onClick={onView}
                    className="flex items-center justify-center p-1 border border-blue-500 rounded hover:bg-blue-50"
                >
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
