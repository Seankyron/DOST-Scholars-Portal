'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScholarFilters } from '@/components/admin/scholars/ScholarFilter';
import { ScholarTable } from '@/components/admin/scholars/ScholarTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { Upload } from 'lucide-react';
import { AddScholarModal } from '@/components/admin/scholars/AddScholarModal';

export default function ScholarManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-dost-title">
        Scholar Management
      </h1>

      {/* Filters Section - This component is now correct */}
      <ScholarFilters />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {/* Standalone Export button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Export logic not yet implemented.')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Export
          </Button>

          {/* Add Scholar Modal Trigger */}
          <AddScholarModal />
        </div>

        <SearchInput
          placeholder="Search Scholars...."
          onSearch={(query: string) => setSearchTerm(query)}
          className="w-full sm:max-w-xs"
        />
      </div>

      {/* Table Section - This component is now correct */}
      <ScholarTable searchTerm={searchTerm} />
    </div>
  );
}