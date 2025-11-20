"use client";

import { Eye, Check, X } from "lucide-react";
import StatusBadge from "../practical-training/badges/StatusBadge";
import TypeBadge from "../practical-training/badges/TypeBadge";

export default function RequestRow({ row, onView }: any) {
  return (
    <tr className="border-b hover:bg-gray-50">

      <td className="p-3">{row.scholar}</td>

      <td className="p-3">
        <TypeBadge type={row.type} />
      </td>

      <td className="p-3">{row.university}</td>

      <td className="p-3">{row.requestForm}</td>

      <td className="p-3">
        <StatusBadge status={row.status} />
      </td>

      <td className="p-3">{row.date}</td>

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
