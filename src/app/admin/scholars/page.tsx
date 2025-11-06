'use client';

import { useState } from 'react'; 
import { Button } from '@/components/ui/button';
import { ScholarFilters } from '@/components/admin/scholars/ScholarFilter';
import { ScholarTable } from '@/components/admin/scholars/ScholarTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { Plus, Upload } from 'lucide-react';

export default function ScholarManagementPage() {
  const [searchTerm, setSearchTerm] = useState(''); 

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-dost-title">
        Scholar Management
      </h1>

      {/* Filters Section */}
      <ScholarFilters />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2"> {/* Use flex-wrap for buttons */}
          <Button variant="outline" size="sm"> {/* Smaller buttons */}
            <Upload className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" size="sm"> {/* Smaller buttons */}
            <Plus className="h-4 w-4 mr-2" />
            Add Scholar
          </Button>
        </div>
        <SearchInput
          placeholder="Search scholars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={() => console.log('Searching for:', searchTerm)} // Placeholder search action
          className="w-full sm:max-w-xs" // Adjusted width for responsiveness
        />
      </div>

      {/* Table Section */}
      <ScholarTable />
    </div>
  );
}