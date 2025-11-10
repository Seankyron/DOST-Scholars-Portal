'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Scholar, YearLevel, Semester, CurriculumConfig } from '@/types';
import { useAuth } from './useAuth';
// Import the correct database types
import type { Database } from '@/lib/supabase/type';

// Define the type for the view row
type ScholarViewRow = Database['public']['Views']['admin_scholar_view']['Row'];

// Helper function to format the year number into YearLevel string
function formatYearLevel(year: number | null): YearLevel {
  if (year === null) return '1st Year'; // Default
  if (year >= 5) return '5th Year'; // or 'Graduated' depending on your logic
  if (year === 1) return '1st Year';
  if (year === 2) return '2nd Year';
  if (year === 3) return '3rd Year';
  if (year === 4) return '4th Year';
  return '1st Year';
}

// Helper function to map the database view to the application's Scholar type
function mapViewToScholar(data: ScholarViewRow): Scholar | null {
  if (!data) return null;

  const yearAwardedNum = parseInt(data.year_awarded || '0', 10);

  const curriculumConfig: CurriculumConfig = {
    midyearYears: data.midyear_classes || [],
    thesisYear: data.thesis_year || 4,
    ojtYear: (data.ojt as any)?.year ? parseInt((data.ojt as any).year, 10) : 4,
    ojtSemester: (data.ojt as any)?.semester || ('1st Semester' as Semester),
    // --- FIX 1: Coerce the number to be 4 or 5 ---
    duration: data.course_duration === 5 ? 5 : 4,
  };

  return {
    id: data.id || '',
    email: data.email || '',
    scholarId: data.spas_id || '',
    firstName: data.first_name || '',
    middleName: data.middle_name || undefined,
    surname: data.last_name || '',
    suffix: data.suffix || undefined,
    contactNumber: data.contact_number || '',
    dateOfBirth: data.date_of_birth || '',
    completeAddress: data.address || '',
    scholarshipType: (data.scholarship_type as any) || 'Merit',
    batch: yearAwardedNum,
    yearAwarded: yearAwardedNum,
    university: data.university || '',
    program: data.program_course || '',
    yearLevel: formatYearLevel(data.current_scholar_year),
    status: (data.scholarship_status as any) || 'Active',
    province: (data.province as any) || 'Laguna',
    curriculumConfig: curriculumConfig,
    curriculumFile: data.curriculum_file_key || undefined,
    profileImage: undefined, // You don't have this in your view
    qrCode: undefined, // You don't have this in your view
    createdAt: data.created_at || '',
    updatedAt: data.created_at || '', // No 'updated_at' in view, use created_at
  };
}

export function useScholar() {
  const { user } = useAuth();
  const [scholar, setScholar] = useState<Scholar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- FIX 2: Add check for user.email ---
    if (!user || !user.email) {
      setLoading(false);
      return;
    }

    // --- EXPLICIT GUARD ---
    // Store the validated email in a new const
    const email = user.email;

    const fetchScholar = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_scholar_view')
          .select('*')
          // Use the guaranteed string 'email' variable
          .eq('email', email) 
          .single();

        if (error) throw error;

        const mappedScholar = mapViewToScholar(data as ScholarViewRow);
        if (mappedScholar) {
          setScholar(mappedScholar);
        } else {
          throw new Error('Could not map scholar data.');
        }
      } catch (err: any) {
        console.error('Error fetching scholar:', err);
        setError('Failed to load scholar data');
      } finally {
        setLoading(false);
      }
    };

    fetchScholar();
  }, [user, supabase]);

  const refetchScholar = async () => {
    // --- FIX 2: Add check for user.email ---
    if (!user || !user.email) return;

    // --- EXPLICIT GUARD ---
    const email = user.email;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_scholar_view')
        .select('*')
        // Use the guaranteed string 'email' variable
        .eq('email', email)
        .single();

      if (error) throw error;

      const mappedScholar = mapViewToScholar(data as ScholarViewRow);
      if (mappedScholar) {
        setScholar(mappedScholar);
      } else {
        throw new Error('Could not map scholar data.');
      }
    } catch (err: any) {
      console.error('Error refetching scholar:', err);
      setError('Failed to reload scholar data');
    } finally {
      setLoading(false);
    }
  };

  return {
    scholar,
    loading,
    error,
    refetchScholar,
  };
}