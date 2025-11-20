import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';


interface SubmissionData {
  id: number;
  spas_id: string;
  year_level: number; 
  semester: string;
  cor_file_key: string;
  grade_file_key: string;
  comment?: string | null;
  created_at?: string | null;
  status: string;
}

export const useUpdateGrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

 
  const updateGrade = useCallback(async (data: SubmissionData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient(); 

    try {
      const { error: supabaseError } = await supabase
        .from('Grade Submission')
        .upsert(
          {
            id: data.id,
            spas_id: data.spas_id,
            year_level: data.year_level,
            semester: data.semester,
            status: 'Pending',
            cor_file_key: data.cor_file_key,
            grade_file_key: data.grade_file_key,
            updated_at: new Date().toISOString(),
            created_at: data.created_at ?? new Date().toISOString(),
            comment: data.comment || null,
          },
          {
            onConflict: 'id',
          }
        );

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Supabase Upsert Error:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  return { updateGrade, loading, error, success };
};