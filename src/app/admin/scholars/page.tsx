'use client'; 

import { Button } from '@/components/ui/button';
import { ScholarFilters } from '@/components/admin/scholars/ScholarFilter';
import { ScholarTable } from '@/components/admin/scholars/ScholarTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { Plus, Upload } from 'lucide-react';

export default function ScholarManagementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-dost-title">
        Scholar Management
      </h1>

      {/* Filters Section */}
      <ScholarFilters />

      {/* Control Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Scholar
          </Button>
        </div>
        <SearchInput
          placeholder="Search scholars..."
          onSearch={() => {}} // This will now work correctly
          className="w-full max-w-sm"
        />
      </div>

      {/* Table Section */}
      <ScholarTable />
    </div>
  );
}