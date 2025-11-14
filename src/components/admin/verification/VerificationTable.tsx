'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type Database } from '@/lib/supabase/type';
import { Pagination } from '@/components/shared/Pagination';
import { VerificationRow, type VerificationRowData } from './VerificationRow';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

// --- NEW: Helper Functions to transform data ---
type PendingAccountView = Database['public']['Views']['admin_scholar_view']['Row'];

const transformAccount = (
  account: PendingAccountView
): VerificationRowData => {
  const midyearClasses = account.midyear_classes || [];
  const ojt = (account.ojt || {}) as {
    year?: string;
    semester?: string;
  };
  const curriculumFile = account.curriculum_file_key
    ? {
        name: account.curriculum_file_key.split('/').pop() || 'Curriculum.pdf',
        url: '', // We need to fetch this URL
      }
    : undefined;

  return {
    id: account.id!, // User UUID
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

interface VerificationTableProps {
  searchTerm: string;
  // --- MODIFIED: State and handlers from parent ---
  selectedAccountIds: string[];
  onSelectAll: (ids: string[]) => void;
  onSelectOne: (id: string) => void;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
}

export function VerificationTable({
  searchTerm,
  selectedAccountIds,
  onSelectAll,
  onSelectOne,
  onVerify,
  onReject,
}: VerificationTableProps) {
  // --- NEW: This component now fetches its own data ---
  const [accounts, setAccounts] = useState<VerificationRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Or make this a prop
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPendingAccounts() {
      setLoading(true);
      let query = supabase
        .from('admin_scholar_view')
        .select('*', { count: 'exact' })
        // --- CRITICAL: Fetch only unverified accounts ---
        .eq('is_verified', false); // Or whatever your default is

      // Apply search
      if (debouncedSearchTerm) {
        query = query.or(
          `full_name.ilike.%${debouncedSearchTerm}%,spas_id.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%`
        );
      }

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to).order('created_at', { ascending: true });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching pending accounts:', error);
        setLoading(false);
        return;
      }

      // --- TODO: Get signed URLs for curriculum files ---
      // This is an advanced step, for now we pass the key
      const transformedData = data.map(transformAccount);
      
      setAccounts(transformedData);
      setTotalAccounts(count || 0);
      setLoading(false);
    }

    fetchPendingAccounts();
  }, [supabase, debouncedSearchTerm, currentPage, itemsPerPage]); // Re-fetch on change

  const totalPages = Math.ceil(totalAccounts / itemsPerPage);
  const isAllSelected =
    accounts.length > 0 &&
    selectedAccountIds.length === accounts.length;

  // --- MODIFIED: Select all now uses the fetched account IDs ---
  const handleSelectAll = (isChecking: boolean) => {
    if (isChecking) {
      onSelectAll(accounts.map((a) => a.id));
    } else {
      onSelectAll([]); // Clear selection
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading pending accounts...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No pending accounts found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              {/* (Other headers: Scholar, SPAS ID, Type, etc.) */}
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Scholar
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SPAS ID
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                University
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Course
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <VerificationRow
                key={account.id}
                account={account}
                isSelected={selectedAccountIds.includes(account.id)}
                onSelect={() => onSelectOne(account.id)}
                onVerify={onVerify}
                onReject={onReject}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing {Math.min(1, totalAccounts)} - {Math.min(accounts.length, totalAccounts)} of {totalAccounts} pending
          accounts
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="sm:justify-self-center"
        />
        <div className="flex sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Export logic not yet implemented.')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </>
  );
}