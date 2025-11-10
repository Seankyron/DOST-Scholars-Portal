'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { SearchInput } from '@/components/shared/SearchInput';
import { VerificationTable } from '@/components/admin/verification/VerificationTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { Check, X } from 'lucide-react';
import { SCHOLARSHIP_TYPES, UNIVERSITIES } from '@/lib/utils/constants';

const MOCK_ACCOUNT_IDS = ['1', '2', '3'];

export default function VerificationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // (Options constants remain the same)
  const scholarshipOptions = [
    { value: 'All', label: 'All Type' },
    ...SCHOLARSHIP_TYPES.map((s) => ({ value: s, label: s })),
  ];
  const universityOptions = [
    { value: 'All', label: 'All Universities' },
    ...UNIVERSITIES.map((u) => ({ value: u, label: u })),
  ];
  const courseOptions = [{ value: 'All', label: 'All Courses' }];

  // (All handlers remain the same)
  const handleSelectOne = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleSelectAll = (isChecking: boolean) => {
    if (isChecking) {
      setSelectedAccountIds(MOCK_ACCOUNT_IDS);
    } else {
      setSelectedAccountIds([]);
    }
  };
  const handleVerifySelected = () => {
    console.log('Verifying accounts:', selectedAccountIds);
    toast.success(`Verified ${selectedAccountIds.length} account(s).`);
    setIsVerifyOpen(false);
    setSelectedAccountIds([]);
  };
  const handleRejectSelected = () => {
    console.log('Rejecting accounts:', selectedAccountIds);
    toast.error(`Rejected ${selectedAccountIds.length} account(s).`);
    setIsRejectOpen(false);
    setSelectedAccountIds([]);
  };

  const selectedCount = selectedAccountIds.length;

  return (
    // --- MODIFIED: Added space-y-6 to match template ---
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-dost-title">
        Account Verification
      </h1>

      {/* Filters Section (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Select
          options={scholarshipOptions}
          defaultValue="All"
        />
        <Select
          options={courseOptions}
          defaultValue="All"
          disabled
        />
        <Select
          options={universityOptions}
          defaultValue="All"
        />
      </div>

      {/* --- MODIFIED: Added new card container --- */}
      <div className="bg-white rounded-lg shadow-md">
        {/* --- MODIFIED: This is now the header *inside* the card --- */}
        {/* Removed bg-white, rounded-t-lg, shadow-md */}
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Pending Accounts
                {selectedCount > 0 && (
                  <span className="text-sm text-gray-500 font-medium ml-2">
                    ({selectedCount} selected)
                  </span>
                )}
              </h2>
              <Button
                variant="primary"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsVerifyOpen(true)}
                disabled={selectedCount === 0}
              >
                <Check className="h-4 w-4 mr-2" />
                Verify
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setIsRejectOpen(true)}
                disabled={selectedCount === 0}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
            <SearchInput
              placeholder="Search Scholars..."
              onSearch={(query: string) => setSearchTerm(query)}
              className="w-full md:max-w-xs"
            />
          </div>
        </div>

        {/* --- MODIFIED: Table is now inside the card --- */}
        <VerificationTable
          searchTerm={searchTerm}
          selectedAccountIds={selectedAccountIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
        />
      </div>

      {/* (Confirmation Dialogs remain the same) */}
      <ConfirmDialog
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        onConfirm={handleVerifySelected}
        title="Verify Selected Accounts"
        description={`Are you sure you want to verify ${selectedCount} account(s)? An email will be sent to each scholar.`}
        variant="info"
        confirmText={`Yes, verify ${selectedCount}`}
      />
      
      <ConfirmDialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleRejectSelected}
        title="Reject Selected Accounts"
        description={`Are you sure you want to reject ${selectedCount} account(s)? This action cannot be undone.`}
        variant="danger"
        confirmText={`Yes, reject ${selectedCount}`}
      />
    </div>
  );
}
