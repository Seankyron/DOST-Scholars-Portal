"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface Props {
  onStatusChange: (value: string) => void;
  onPurposeChange: (value: string) => void;
}

export default function TravelClearanceFilters({
  onStatusChange,
  onPurposeChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Uploaded file:", file.name);
    }
  };

  return (
    <div className="flex items-center gap-6 mb-6 flex-wrap">
      <div>
        <Label>Status</Label>
        <select
          className="border rounded-md p-2 w-[150px]"
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div>
        <Label>Purpose</Label>
        <select
          className="border rounded-md p-2 w-[170px]"
          onChange={(e) => onPurposeChange(e.target.value)}
        >
          <option value="All">All Purposes</option>
          <option value="Official Business Travel">Official Business Travel</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <Label>Date Range</Label>
        <div className="flex items-center gap-2">
          <Input type="date" className="w-[160px]" />
          <span>-</span>
          <Input type="date" className="w-[160px]" />
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <Button variant="outline" className="ml-auto flex gap-2" onClick={handleUploadClick}>
        <FileDown size={18} />
        Export Report
      </Button>
    </div>
  );
}
