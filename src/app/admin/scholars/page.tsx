'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScholarFilters } from '@/components/admin/scholars/ScholarFilter';
import { ScholarTable } from '@/components/admin/scholars/ScholarTable';
import { SearchInput } from '@/components/shared/SearchInput';
import Export from '@/components/admin/scholars/Export';
import { Upload } from 'lucide-react';
import { AddScholarModal } from '@/components/admin/scholars/AddScholarModal';

export default function ScholarManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'All',
    status: 'All',
    university: 'All',
    year: 'All',
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-dost-title">Scholar Management</h1>

      {/* Filters Section */}
      <ScholarFilters filters={filters} onChange={setFilters} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <Export />
          <AddScholarModal />
        </div>

        <SearchInput
          placeholder="Search Scholars...."
          onSearch={(query: string) => setSearchTerm(query)}
          className="w-full sm:max-w-xs"
        />
      </div>

      {/* Table Section */}
      <ScholarTable searchTerm={searchTerm} filters={filters} />
    </div>
  );
}
