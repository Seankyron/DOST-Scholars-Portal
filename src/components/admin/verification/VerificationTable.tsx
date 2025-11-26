'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type Database } from '@/lib/supabase/type';
import { Pagination } from '@/components/shared/Pagination';
import { VerificationRow, type VerificationRowData } from './VerificationRow';
import { VerificationModal } from './VerificationModal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/toaster';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { Download, Loader2, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Data Transformation Helper ---
type PendingAccountView = Database['public']['Views']['admin_scholar_view']['Row'];

const transformAccount = (account: PendingAccountView): VerificationRowData => {
  const midyearClasses = account.midyear_classes || [];
  const ojt = (account.ojt || {}) as { year?: string; semester?: string };
  const curriculumFile = account.curriculum_file_key
    ? {
        name: account.curriculum_file_key.split('/').pop() || 'Curriculum.pdf',
        url: '', // Signed URLs would be fetched here in a real implementation
      }
    : undefined;

  return {
    id: account.id!,
    scholarId: account.spas_id || 'N/A',
    email: account.email || 'N/A',
    firstName: account.first_name || '',
    middleName: account.middle_name || '',
    surname: account.last_name || '',
    suffix: account.suffix || '',
    fullName: account.full_name || 'No Name',
    dateOfBirth: account.date_of_birth || '',
    contactNumber: account.contact_number || '',
    addressBrgy: account.address || '',
    addressCity: account.municipality_city || '',
    addressProvince: account.province || '',
    scholarshipType: account.scholarship_type || 'N/A',
    yearAwarded: account.year_awarded || 'N/A',
    university: account.university || 'N/A',
    program: account.program_course || 'N/A',
    courseDuration: account.course_duration?.toString() || 'N/A',
    ojtYear: ojt.year || 'N/A',
    ojtSemester: ojt.semester || 'N/A',
    midyear1stYear: midyearClasses.includes(1),
    midyear2ndYear: midyearClasses.includes(2),
    midyear3rdYear: midyearClasses.includes(3),
    midyear4thYear: midyearClasses.includes(4),
    thesis1stYear: account.thesis_year === 1,
    thesis2ndYear: account.thesis_year === 2,
    thesis3rdYear: account.thesis_year === 3,
    thesis4thYear: account.thesis_year === 4,
    curriculumFile: curriculumFile,
  };
};

const ITEMS_PER_PAGE = 7;

interface VerificationTableProps {
  searchTerm: string;
}

export function VerificationTable({ searchTerm }: VerificationTableProps) {
  const router = useRouter();
  const supabase = createClient();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // --- State ---
  const [accounts, setAccounts] = useState<VerificationRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selection
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<VerificationRowData | null>(null);
  
  // Bulk Actions
  const [bulkActionType, setBulkActionType] = useState<'Verify' | 'Reject' | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch Logic ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('admin_scholar_view')
        .select('*', { count: 'exact' })
        .eq('is_verified', false);

      if (debouncedSearchTerm) {
        query = query.or(
          `full_name.ilike.%${debouncedSearchTerm}%,spas_id.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%`
        );
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to).order('created_at', { ascending: true });

      const { data, error, count } = await query;

      if (error) throw error;

      setAccounts(data.map(transformAccount));
      setTotalAccounts(count || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch pending accounts.');
    } finally {
      setLoading(false);
    }
  }, [supabase, debouncedSearchTerm, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Selection Logic ---
  const handleSelectOne = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedAccountIds(accounts.map((a) => a.id));
    } else {
      setSelectedAccountIds([]);
    }
  };

  const isAllSelected = accounts.length > 0 && accounts.every((a) => selectedAccountIds.includes(a.id));
  const selectedCount = selectedAccountIds.length;

  // --- Action Logic ---
  const initiateBulkAction = (type: 'Verify' | 'Reject') => {
    setBulkActionType(type);
    setIsConfirmOpen(true);
  };

  const executeAction = async () => {
    if (!bulkActionType) return;
    setIsSubmitting(true);
    
    const endpoint = bulkActionType === 'Verify' 
      ? '/api/admin/verify-accounts' 
      : '/api/admin/reject-accounts';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedAccountIds }),
      });

      if (!response.ok) throw new Error(`Failed to ${bulkActionType.toLowerCase()} accounts`);

      toast.success(`Successfully ${bulkActionType === 'Verify' ? 'verified' : 'rejected'} ${selectedCount} account(s).`);
      
      // Reset state
      setIsConfirmOpen(false);
      setBulkActionType(null);
      setSelectedAccountIds([]);
      setIsModalOpen(false); // Close details modal if open
      fetchData(); // Refresh table
      router.refresh();
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Modal Logic ---
  const handleViewDetails = (account: VerificationRowData) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  // Wrapper for Single Action inside Modal
  const handleSingleAction = (type: 'Verify' | 'Reject') => {
     if(!selectedAccount) return;
     setSelectedAccountIds([selectedAccount.id]); // Temporarily select just this one
     setBulkActionType(type);
     setIsConfirmOpen(true);
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-dost-title" />
      </div>
    );
  }

  const totalPages = Math.ceil(totalAccounts / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalAccounts);

  return (
    <>
      {/* Bulk Action Bar - Matches StipendTracking style */}
      <div className="bg-gray-50 px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 min-h-[50px]">
        <div className="flex items-center gap-2 flex-wrap">
          {selectedCount > 0 ? (
            <>
              <span className="text-sm font-medium text-gray-700 mr-2">
                {selectedCount} selected
              </span>
              <Button
                variant="primary"
                size="sm"
                className="bg-green-600 hover:bg-green-700 h-8"
                onClick={() => initiateBulkAction('Verify')}
                disabled={isSubmitting}
              >
                <Check className="h-3 w-3 mr-1.5" />
                Verify
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-600 hover:bg-red-700 h-8"
                onClick={() => initiateBulkAction('Reject')}
                disabled={isSubmitting}
              >
                <X className="h-3 w-3 mr-1.5" />
                Reject
              </Button>
            </>
          ) : (
            <span className="text-sm text-gray-500 italic">Select rows to perform bulk actions</span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <Checkbox
                  checked={isAllSelected}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)}
                  aria-label="Select all rows"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPAS ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <VerificationRow
                key={account.id}
                account={account}
                isSelected={selectedAccountIds.includes(account.id)}
                onSelect={() => handleSelectOne(account.id)}
                onView={() => handleViewDetails(account)}
              />
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-sm text-gray-500">
                  No pending accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 border-t">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing {totalAccounts > 0 ? startItem : 0}-{endItem} of {totalAccounts} records
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="sm:justify-self-center"
        />
        <div className="flex sm:justify-end">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      {selectedAccount && (
        <VerificationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          accountData={selectedAccount}
          onVerify={() => handleSingleAction('Verify')}
          onReject={() => handleSingleAction('Reject')}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeAction}
        title={bulkActionType === 'Verify' ? "Verify Accounts" : "Reject Accounts"}
        description={
            bulkActionType === 'Verify' 
            ? `Are you sure you want to verify ${selectedAccountIds.length} account(s)? An email will be sent to notify them.`
            : `Are you sure you want to reject ${selectedAccountIds.length} account(s)? This action cannot be undone.`
        }
        confirmText={bulkActionType === 'Verify' ? "Yes, Verify" : "Yes, Reject"}
        variant={bulkActionType === 'Verify' ? "info" : "danger"}
        isLoading={isSubmitting}
      />
    </>
  );
}