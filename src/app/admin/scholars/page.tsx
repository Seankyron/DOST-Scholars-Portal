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
  // --- MODIFIED: Import the correct type from ScholarRow ---
  type ScholarRowData,
} from '@/components/admin/scholars/ScholarTable';
import { SearchInput } from '@/components/shared/SearchInput';
// --- NEW: Import Modals ---
import { ViewScholarModal } from '@/components/admin/scholars/ViewScholarModal';
// import { EditScholarModal } from '@/components/admin/scholars/EditScholarModal'; // (Assuming you have this)
// import { ConfirmDeleteModal } from '@/components/admin/scholars/ConfirmDeleteModal'; // (Assuming you have this)
// import { ScholarHistoryModal } from '@/components/admin/scholars/ScholarHistoryModal'; // (Assuming you have this)

import type { ScholarStatus } from '@/types/scholar';
import { useDebounce } from '@/hooks/useDebounce';

type ScholarViewRow = Database['public']['Views']['admin_scholar_view']['Row'];

// --- NEW: Added helper from your file ---
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
// --- END OF HELPERS ---

const ITEMS_PER_PAGE = 7;

export default function ScholarManagementPage() {
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

  // --- NEW: State to manage all modals ---
  const [viewingScholar, setViewingScholar] = useState<ScholarRowData | null>(
    null
  );
  // --- (Add state for other modals as you build them) ---
  // const [editingScholar, setEditingScholar] = useState<ScholarRowData | null>(null);
  // const [deletingScholar, setDeletingScholar] = useState<ScholarRowData | null>(null);
  // const [historyScholar, setHistoryScholar] = useState<ScholarRowData | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchScholars() {
      setLoading(true);
      let query = supabase
        .from('admin_scholar_view')
        .select('*', { count: 'exact' });

      // ... (Filtering logic remains the same) ...
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

      // --- CRITICAL FIX: Transform the data to match ScholarRowData ---
      const transformedScholars: ScholarRowData[] = data.map(
        (scholar: ScholarViewRow) => {
          // Parse complex fields
          const midyearClasses = scholar.midyear_classes || [];
          const ojt = (scholar.ojt || {}) as {
            year?: string;
            semester?: string;
          };
          const curriculumFile = scholar.curriculum_file_key
            ? { name: scholar.curriculum_file_key, url: '' } // URL would be fetched separately
            : undefined;

          return {
            id: scholar.id || crypto.randomUUID(), // For React key
            scholarId: scholar.spas_id || 'N/A',
            email: scholar.email || 'N/A',
            firstName: scholar.first_name || '',
            middleName: scholar.middle_name || '',
            surname: scholar.last_name || '',
            suffix: scholar.suffix || '',
            dateOfBirth: scholar.date_of_birth || '',
            contactNumber: scholar.contact_number || '',
            addressBrgy: scholar.address || '',
            addressCity: scholar.municipality_city || '',
            addressProvince: scholar.province || '',
            scholarshipType: scholar.scholarship_type || 'N/A',
            yearAwarded: scholar.year_awarded || 'N/A',
            university: scholar.university || 'N/A',
            program: scholar.program_course || 'N/A',
            courseDuration: scholar.course_duration?.toString() || 'N/A',
            status: (scholar.scholarship_status || 'N/A') as ScholarStatus,
            yearLevel: formatYear(scholar.current_scholar_year), // For display in table
            
            // Map array/number to booleans
            midyear1stYear: midyearClasses.includes(1),
            midyear2ndYear: midyearClasses.includes(2),
            midyear3rdYear: midyearClasses.includes(3),
            midyear4thYear: midyearClasses.includes(4),
            thesis1stYear: scholar.thesis_year === 1,
            thesis2ndYear: scholar.thesis_year === 2,
            thesis3rdYear: scholar.thesis_year === 3,
            thesis4thYear: scholar.thesis_year === 4,

            // Map JSON to strings
            ojtYear: ojt.year || 'N/A',
            ojtSemester: ojt.semester || 'N/A',

            curriculumFile: curriculumFile,
          };
        }
      );
      // --- END OF FIX ---

      setScholars(transformedScholars);
      setTotalScholars(count || 0);
      setLoading(false);
    }
    fetchScholars();
  }, [supabase, filters, debouncedSearchTerm, currentPage]);

  // --- (Handlers remain the same) ---
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

  // --- NEW: Handlers for modal actions ---
  const handleView = (scholar: ScholarRowData) => setViewingScholar(scholar);
  // const handleEdit = (scholar: ScholarRowData) => setEditingScholar(scholar);
  // const handleHistory = (scholar: ScholarRowData) => setHistoryScholar(scholar);
  // const handleDelete = (scholar: ScholarRowData) => setDeletingScholar(scholar);
  const handleCloseModals = () => {
    setViewingScholar(null);
    // setEditingScholar(null);
    // setDeletingScholar(null);
    // setHistoryScholar(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dost-title">
        Scholar Management
      </h1>

      <ScholarFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="bg-white rounded-lg shadow-md">
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
            // --- NEW: Pass handlers down ---
            onView={handleView}
            onEdit={(scholar) => alert(`Editing ${scholar.firstName}`)} // Placeholder
            onHistory={(scholar) => alert(`History for ${scholar.firstName}`)} // Placeholder
            onDelete={(scholar) => alert(`Deleting ${scholar.firstName}`)} // Placeholder
          />
        )}
      </div>

      {/* --- NEW: Render modals --- */}
      {viewingScholar && (
        <ViewScholarModal
          scholar={viewingScholar}
          open={!!viewingScholar}
          onClose={handleCloseModals}
        />
      )}
      {/* (Render other modals here) */}
    </div>
  );
}