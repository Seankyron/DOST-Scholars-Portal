import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';


interface SubmissionData {
  spas_id: string;
  year: number; 
  semester: string;
  regFormUrl: string;
  gradesUrl: string;
  comment?: string | null;
  created_at?: string | null;
}

export const useSubmitGrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

 
  const submitGrade = useCallback(async (data: SubmissionData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient(); 

    try {
      const { error: supabaseError } = await supabase
        .from('Grade Submission')
        .upsert(
          {
            spas_id: data.spas_id,
            year_level: data.year,
            semester: data.semester,
            status: 'Pending',
            cor_file_key: data.regFormUrl,
            grade_file_key: data.gradesUrl,
            updated_at: new Date().toISOString(),
            created_at: data.created_at ?? new Date().toISOString(),
            comment: data.comment || null,
          },
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

  return { submitGrade, loading, error, success };
};
