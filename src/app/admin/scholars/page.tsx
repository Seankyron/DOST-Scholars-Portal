'use client';
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
  type ScholarRowData, // Import the data type
} from '@/components/admin/scholars/ScholarTable';
import { SearchInput } from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import type { ScholarStatus } from '@/types/scholar';
// Assuming you have this hook from your file list.
// If not, you can just use the 'searchTerm' directly inside the useEffect.
import { useDebounce } from '@/hooks/useDebounce';

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

const ITEMS_PER_PAGE = 7; // As seen in your mock data

export default function ScholarManagementPage() {
  // --- All application state lives here ---
  const [scholars, setScholars] = useState<ScholarRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalScholars, setTotalScholars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce for search
  const [filters, setFilters] = useState<ScholarFiltersState>({
    scholarshipType: 'All',
    status: 'All',
    university: 'All',
    course: 'All',
    yearLevel: 'All',
  });

  const supabase = createClient();

  // --- Main Data Fetching Effect ---
  // Re-runs whenever filters, search term, or page changes
  useEffect(() => {
    async function fetchScholars() {
      setLoading(true);

      let query = supabase
        .from('admin_scholar_view')
        .select('*', { count: 'exact' });

      // 1. Apply Filters
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
      // Note: 'course' filter is disabled, so we don't add it to the query

      // 2. Apply Debounced Search Term
      if (debouncedSearchTerm) {
        query = query.or(
          `full_name.ilike.%${debouncedSearchTerm}%,spas_id.ilike.%${debouncedSearchTerm}%,email.ilike.%${debouncedSearchTerm}%`
        );
      }

      // 3. Apply Pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to).order('last_name', { ascending: true });

      // 4. Execute Query
      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching scholars:', error);
        setLoading(false);
        return;
      }

      // 5. Transform data for the "dumb" table component
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
          profileImage: '/images/placeholders/avatar-placeholder.png', // Default
        })
      );

      // 6. Set State
      setScholars(transformedScholars);
      setTotalScholars(count || 0);
      setLoading(false);
    }

    fetchScholars();
  }, [supabase, filters, debouncedSearchTerm, currentPage]); // Dependencies

  // --- State Handlers ---
  const handleFilterChange = (
    filterName: keyof ScholarFiltersState,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-dost-title">
        Scholar Management
      </h1>

      {/* Filters Section - This component is now correct */}
      <ScholarFilters filters={filters} onFilterChange={handleFilterChange} />

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

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
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
  );
}