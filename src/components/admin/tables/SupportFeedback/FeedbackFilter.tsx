"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FeedbackFilterProps {
  onFilterChange: (filters: { search: string }) => void;
}

export default function FeedbackFilter({ onFilterChange }: FeedbackFilterProps) {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex flex-col">
        <Input
          placeholder="Search scholar or year..."
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-60"
        />
      </div>
    </div>
  );
}
