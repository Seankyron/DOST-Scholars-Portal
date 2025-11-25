'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UNIVERSITIES } from '@/lib/utils/constants';

export function PTPFilters() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Status */}
      <Select defaultValue="All">
        <SelectTrigger>
          <SelectValue placeholder="Status: All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Status</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Resubmit">Resubmit</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
      
      {/* 2. Request Detail (Type) */}
      <Select defaultValue="All">
        <SelectTrigger>
          <SelectValue placeholder="Type: All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Transaction Types</SelectItem>
          <SelectItem value="Referral Letter">Referral Letter</SelectItem>
          <SelectItem value="Program Completion">Program Completion</SelectItem>
        </SelectContent>
      </Select>

      {/* 3. Training Year */}
      <Select defaultValue="All">
        <SelectTrigger>
          <SelectValue placeholder="Training Year: All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Training Years</SelectItem>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
        </SelectContent>
      </Select>
      
      {/* 4. University */}
      <Select defaultValue="All">
        <SelectTrigger>
           <SelectValue placeholder="School: All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Universities</SelectItem>
          {UNIVERSITIES.map((u) => (
            <SelectItem key={u} value={u}>{u}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}