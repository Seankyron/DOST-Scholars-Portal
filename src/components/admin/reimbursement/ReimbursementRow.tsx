"use client";

import { Eye, Check, X } from "lucide-react";
import StatusBadge from "../practical-training/badges/StatusBadge";
import TypeBadge from "../practical-training/badges/TypeBadge";

export default function ReimbursementRow({ row, onView }: any) {
  return (
    <tr className="border-b hover:bg-gray-50">
    <td className="p-3 cursor-pointer">
        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
      </td>
      <td className="p-3 cursor-default">{row.scholar}</td>

      <td className="p-3 cursor-default">
        <TypeBadge type={row.type} />
      </td>

      <td className="p-3 cursor-default">{row.university}</td>

      <td className="p-3 cursor-default">{row.reimbursement}</td>

      <td className="p-3 cursor-default">
        <StatusBadge status={row.status} />   
      </td>

      <td className="p-3 cursor-default">{row.date}</td>

      <td className="p-3 flex gap-2">
        <button
          onClick={onView}
          className="p-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button className="p-1 rounded bg-green-500 hover:bg-green-600 text-white">
          <Check className="w-4 h-4" />
        </button>

        <button className="p-1 rounded bg-red-500 hover:bg-red-600 text-white">
          <X className="w-4 h-4" />
        </button>
      </td>

    </tr>
  );
}
