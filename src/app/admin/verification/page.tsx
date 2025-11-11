'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { SearchInput } from '@/components/shared/SearchInput';
import { VerificationTable } from '@/components/admin/verification/VerificationTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from '@/components/ui/toaster';
import { Check, X, Loader2 } from 'lucide-react';
import { SCHOLARSHIP_TYPES, UNIVERSITIES } from '@/lib/utils/constants';
import { useRouter } from 'next/navigation';

export default function VerificationPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  
  // --- MODIFIED: These handlers are for state managed by this page ---
  const handleSelectOne = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids: string[]) => {
    // This function receives the list of *all* IDs from the table
    if (ids.length > 0 && selectedAccountIds.length === ids.length) {
      // If all are selected, deselect all
      setSelectedAccountIds([]);
    } else {
      // Otherwise, select all
      setSelectedAccountIds(ids);
    }
  };

  // --- MODIFIED: Handlers for API calls ---
  
  // Single verify/reject from modal
  const handleVerifyOne = async (id: string) => {
    await handleVerifySelected([id]);
  };
  
  const handleRejectOne = async (id: string) => {
    await handleRejectSelected([id]);
  };

  // Bulk verify/reject
  const handleVerifySelected = async (ids: string[] = selectedAccountIds) => {
    setIsSubmitting(true);
    setIsVerifyOpen(false);
    
    try {
      const response = await fetch('/api/admin/verify-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: ids }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error('Failed to verify one or more accounts');
      
      toast.success(`Verified ${ids.length} account(s).`);
      setSelectedAccountIds([]);
      router.refresh(); // Refresh data in the table
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSelected = async (ids: string[] = selectedAccountIds) => {
    setIsSubmitting(true);
    setIsRejectOpen(false);

    try {
      const response = await fetch('/api/admin/reject-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: ids }),
      });
      if (!response.ok) throw new Error('Failed to reject one or more accounts');
      
      toast.error(`Rejected ${ids.length} account(s).`);
      setSelectedAccountIds([]);
      router.refresh(); // Refresh data in the table
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCount = selectedAccountIds.length;
  const isActionDisabled = selectedCount === 0 || isSubmitting;
  
  const getButtonContent = (text: string) => {
    return isSubmitting ? (
      <>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Processing...
      </>
    ) : (
      <>
        {text === 'Verify' ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />}
        {text}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-dost-title">
        Account Verification
      </h1>

      {/* Filters Section (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Select
          options={scholarshipOptions}
          defaultValue="All"
          // TODO: Wire up to filters state
        />
        <Select
          options={courseOptions}
          defaultValue="All"
          disabled
          // TODO: Wire up to filters state
        />
        <Select
          options={universityOptions}
          defaultValue="All"
          // TODO: Wire up to filters state
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
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
                disabled={isActionDisabled}
              >
                {getButtonContent('Verify')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setIsRejectOpen(true)}
                disabled={isActionDisabled}
              >
                {getButtonContent('Reject')}
              </Button>
            </div>
            <SearchInput
              placeholder="Search Scholars..."
              onSearch={(query: string) => setSearchTerm(query)}
              className="w-full md:max-w-xs"
            />
          </div>
        </div>

        <VerificationTable
          searchTerm={searchTerm}
          selectedAccountIds={selectedAccountIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          // --- NEW: Pass single handlers down ---
          onVerify={handleVerifyOne}
          onReject={handleRejectOne}
        />
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        onConfirm={() => handleVerifySelected()}
        title="Verify Selected Accounts"
        description={`Are you sure you want to verify ${selectedCount} account(s)? An email will be sent to each scholar.`}
        variant="info"
        confirmText={`Yes, verify ${selectedCount}`}
      />
      
      <ConfirmDialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={() => handleRejectSelected()}
        title="Reject Selected Accounts"
        description={`Are you sure you want to reject ${selectedCount} account(s)? This action cannot be undone.`}
        variant="danger"
        confirmText={`Yes, reject ${selectedCount}`}
      />
    </div>
  );
}