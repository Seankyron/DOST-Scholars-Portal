'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type Database } from '@/lib/supabase/type';
import { ScholarRow, type ScholarRowData } from './ScholarRow';
import { Pagination } from '@/components/shared/Pagination';
import { type ScholarFiltersState } from './ScholarFilter';
import type { ScholarStatus } from '@/types/scholar';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/toaster';
import Export from '@/components/shared/Export';

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
// --- End Helper Functions ---

interface ScholarTableProps {
  filters: ScholarFiltersState;
  searchTerm: string;
  page: number;
  itemsPerPage: number;
  refreshKey: number;
  onPageChange: (newPage: number) => void;
  onView: (scholar: ScholarRowData) => void;
  onEdit: (scholar: ScholarRowData) => void;
  onHistory: (scholar: ScholarRowData) => void;
  onDelete: (scholar: ScholarRowData) => void;
}

export function ScholarTable({
  filters,
  searchTerm,
  page,
  itemsPerPage,
  refreshKey,
  onPageChange,
  onView,
  onEdit,
  onHistory,
  onDelete,
}: ScholarTableProps) {
  const [scholars, setScholars] = useState<ScholarRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalScholars, setTotalScholars] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const supabase = createClient();

  const exportData = useMemo(() => {
    return scholars.map((scholar) => ({
      "SPAS ID": scholar.scholarId,
      "Full Name": `${scholar.surname}, ${scholar.firstName} ${scholar.middleName} ${scholar.suffix}`.trim(),
      "Email": scholar.email,
      "Scholarship Type": scholar.scholarshipType,
      "Year Awarded": scholar.yearAwarded,
      "University": scholar.university,
      "Program": scholar.program,
      "Year Level": scholar.yearLevel,
      "Status": scholar.status,
      "Contact Number": scholar.contactNumber,
      "Address (Brgy)": scholar.addressBrgy,
      "Address (City)": scholar.addressCity,
      "Address (Province)": scholar.addressProvince,
      "Date of Birth": scholar.dateOfBirth,

    }));
  }, [scholars]);

  useEffect(() => {
    async function fetchScholars() {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('admin_scholar_view')
        .select('*', { count: 'exact' });

      // Apply Filters
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
      
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to).order('last_name', { ascending: true });
      
      try {
        const { data, error, count } = await query;

        if (error) throw error;

        // Transform data
        const transformedScholars: ScholarRowData[] = (data || []).map(
          (scholar: ScholarViewRow) => {
            const midyearClasses = scholar.midyear_classes || [];
            const ojt = (scholar.ojt || {}) as { year?: string; semester?: string };
            const curriculumFile = scholar.curriculum_file_key
              ? { name: scholar.curriculum_file_key, url: '' }
              : undefined;

            return {
              id: scholar.id || crypto.randomUUID(),
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
              yearLevel: formatYear(scholar.current_scholar_year),
              midyear1stYear: midyearClasses.includes(1),
              midyear2ndYear: midyearClasses.includes(2),
              midyear3rdYear: midyearClasses.includes(3),
              midyear4thYear: midyearClasses.includes(4),
              thesis1stYear: scholar.thesis_year === 1,
              thesis2ndYear: scholar.thesis_year === 2,
              thesis3rdYear: scholar.thesis_year === 3,
              thesis4thYear: scholar.thesis_year === 4,
              ojtYear: ojt.year || 'N/A',
              ojtSemester: ojt.semester || 'N/A',
              curriculumFile: curriculumFile,
            };
          }
        );

        setScholars(transformedScholars);
        setTotalScholars(count || 0);

      } catch (err: any) {
        console.error('Error fetching scholars:', err);
        setError('Failed to load scholars.');
        toast.error("Error", {
          description: "Failed to load scholar data.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchScholars();
  }, [supabase, filters, debouncedSearchTerm, page, itemsPerPage, refreshKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-dost-title" />
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col items-center justify-center h-48 gap-4">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(totalScholars / itemsPerPage);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scholar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SPAS ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year Level</th>
              <th className="px-4 py-3 text-left text-xs font-module text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scholars.length > 0 ? (
              scholars.map((scholar) => (
                <ScholarRow
                  key={scholar.id}
                  scholar={scholar}
                  onView={onView}
                  onEdit={onEdit}
                  onHistory={onHistory}
                  onDelete={onDelete}
                />
              ))
            ) : (
               <tr>
                 <td colSpan={9} className="text-center py-8 text-gray-500 text-sm">
                   No scholars found.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 border-t">
        <p className="text-sm text-gray-700 sm:justify-self-start sm:text-left">
          Showing {scholars.length} of {totalScholars} Scholars
        </p>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="sm:justify-self-center"
        />

        <div className="flex sm:justify-end gap-2">
          <Export 
            data={exportData} 
            fileName={`Scholar_Report_${new Date().toISOString().split('T')[0]}`} 
            label="Export Report"
          />
        </div>
      </div>
    </>
  );
}