"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export default function RequestFilters({ filters, setFilters }: any) {
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 rounded-lg shadow-sm">

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">Request Form:</label>
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filters.form}
          onChange={(e) => setFilters({ ...filters, form: e.target.value })}
        >
          <option value="all">All Forms</option>
          <option value="tuition">Tuition Fee Request</option>
          <option value="allowance">Allowance Request</option>
          <option value="enrollment">Enrollment Request</option>
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
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
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
