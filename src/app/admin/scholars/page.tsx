'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type Database } from '@/lib/supabase/type';
import { AddScholarModal } from '@/components/admin/scholars/AddScholarModal';
import {
  ScholarFilters,
  type ScholarFiltersState,
} from '@/components/admin/scholars/ScholarFilter';
import {
  ScholarTable,
  type ScholarRowData,
} from '@/components/admin/scholars/ScholarTable';
import { SearchInput } from '@/components/shared/SearchInput';
// --- Button and Upload removed, they are now in the table component ---
import type { ScholarStatus } from '@/types/scholar';
import { useDebounce } from '@/hooks/useDebounce';

// (Helper functions formatYear, getYearLevelNumber, ITEMS_PER_PAGE remain the same)
// --- Helper Functions ---
type ScholarViewRow = Database['public']['Views']['admin_scholar_view']['Row'];

const formatYear = (year: number | null): string => {
  if (year === null) return 'N/A';
  if (year > 4) return 'Graduated';
  if (year === 1) return '1st Year';
  if (year === 2) return '2nd Year';
  if (year === 3) return '3rd Year';
  if (year === 4) return '4th Year';
  return 'N/A';
};

const getYearLevelNumber = (yearString: string): number | null => {
  if (yearString === '1st Year') return 1;
  if (yearString === '2nd Year') return 2;
  if (yearString === '3rd Year') return 3;
  if (yearString === '4th Year') return 4;
  if (yearString === 'Graduated') return 5;
  return null;
};

const ITEMS_PER_PAGE = 7;

export default function ScholarManagementPage() {
  // (State and useEffect logic remains the same)
  const [scholars, setScholars] = useState<ScholarRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalScholars, setTotalScholars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filters, setFilters] = useState<ScholarFiltersState>({
    scholarshipType: 'All',
    status: 'All',
    university: 'All',
    course: 'All',
    yearLevel: 'All',
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchScholars() {
      setLoading(true);
      let query = supabase
        .from('admin_scholar_view')
        .select('*', { count: 'exact' });
      // ... (filtering logic) ...
      if (filters.scholarshipType !== 'All') {
        query = query.eq('scholarship_type', filters.scholarshipType);
      }
      if (filters.status !== 'All') {
        query = query.eq('scholarship_status', filters.status);
      }
      if (filters.university !== 'All') {
        query = query.eq('university', filters.university);
      }
      const yearLevelNum = getYearLevelNumber(filters.yearLevel);
      if (yearLevelNum) {
        query = query.eq('current_scholar_year', yearLevelNum);
      }
      if (debouncedSearchTerm) {
        query = query.or(
          `full_name.ilike.%${debouncedSearchTerm}%,spas_id.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%`
        );
      }
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to).order('last_name', { ascending: true });
      const { data, error, count } = await query;
      if (error) {
        console.error('Error fetching scholars:', error);
        setLoading(false);
        return;
      }
      const transformedScholars: ScholarRowData[] = data.map(
        (scholar: ScholarViewRow) => ({
          id: scholar.id || '',
          name: scholar.full_name || 'No Name',
          scholarId: scholar.spas_id || 'N/A',
          scholarshipType: scholar.scholarship_type || 'N/A',
          university: scholar.university || 'N/A',
          yearLevel: formatYear(scholar.current_scholar_year),
          program: scholar.program_course || 'N/A',
          status: (scholar.scholarship_status || 'N/A') as ScholarStatus,
          email: scholar.email || 'N/A',
          profileImage: '/images/placeholders/avatar-placeholder.png',
        })
      );
      setScholars(transformedScholars);
      setTotalScholars(count || 0);
      setLoading(false);
    }
    fetchScholars();
  }, [supabase, filters, debouncedSearchTerm, currentPage]);

  const handleFilterChange = (
    filterName: keyof ScholarFiltersState,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Scholar Management
      </h1>

      <ScholarFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="bg-white rounded-lg shadow-md">
        {/* --- MODIFIED: Header layout changed as requested --- */}
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Scholars
            </h2>
            <AddScholarModal />
          </div>

          <SearchInput
            placeholder="Search Scholars...."
            onSearch={(query: string) => {
              setSearchTerm(query);
              setCurrentPage(1);
            }}
            className="w-full sm:max-w-xs"
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading scholars...</p>
          </div>
        ) : (
          <ScholarTable
            scholars={scholars}
            totalScholars={totalScholars}
            page={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
