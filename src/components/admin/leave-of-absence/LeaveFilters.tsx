"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export default function LeaveFilters({ filters, setFilters }: any) {
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 rounded-lg shadow-sm">

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">Reason:</label>
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.reason}
          onChange={(e) => setFilters({ ...filters, reason: e.target.value })}
        >
          <option value="all">All Reasons</option>
          <option value="medical">Medical</option>
          <option value="personal">Personal</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">Status:</label>
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">Date Range:</label>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="w-40 text-sm"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
          <span className="text-gray-500">-</span>
          <Input
            type="date"
            className="w-40 text-sm"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-2 ml-auto">
        <Button className="bg-green-500 hover:bg-green-600 text-white flex gap-2">
          <Check className="w-4 h-4" /> Verify
        </Button>

        <Button className="bg-red-500 hover:bg-red-600 text-white flex gap-2">
          <X className="w-4 h-4" /> Reject
        </Button>
      </div>
    </div>
  );
}
