'use client';

import { useState } from 'react';
import { SearchInput } from '@/components/shared/SearchInput';
import { VerificationTable } from '@/components/admin/verification/VerificationTable';

export default function VerificationPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Account Verification
      </h1>

      {/* Note: Filters removed as requested, keeping structure simple */}

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Pending Accounts
          </h2>
          <SearchInput
            placeholder="Search Scholars..."
            onSearch={setSearchTerm}
            className="w-full sm:max-w-xs"
          />
        </div>
        <VerificationTable searchTerm={searchTerm} />
      </div>
    </div>
  );
}