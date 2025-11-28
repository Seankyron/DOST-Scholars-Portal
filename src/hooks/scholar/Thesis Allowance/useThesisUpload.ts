import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ThesisSubmissionPayload {
  spas_id: string;
  type: string;
  abstract_thesis_file_key?: string | null;
  approval_file_key?: string | null;
  final_thesis_file_key?: string | null;
  status?: string;
}

export const useThesisUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitThesis = useCallback(async (data: ThesisSubmissionPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (data.type == '90%') {
        const { error: supabaseError } = await supabase
          .from('Thesis Allowance')
          .upsert(
          {
            spas_id: data.spas_id,
            type: data.type,
            abstract_thesis_file_key: data.abstract_thesis_file_key,
            approval_file_key: data.approval_file_key,
            final_thesis_file_key: null,
            comment: null,
            created_at: new Date().toISOString(),
            status: 'Pending',
          },
          );

          if (supabaseError) {
            throw new Error(supabaseError.message);
          }
      }

      else if (data.type == '10%') {
        const { error: supabaseError } = await supabase
          .from('Thesis Allowance')
          .upsert(
          {
            spas_id: data.spas_id,
            type: data.type,
            abstract_thesis_file_key: null,
            approval_file_key: null,
            final_thesis_file_key: data.final_thesis_file_key,
            comment: null,
            created_at: new Date().toISOString(),
            status: 'Pending',
          },
          );

          if (supabaseError) {
            throw new Error(supabaseError.message);
          }
      }

      else {
          const { error: supabaseError } = await supabase
          .from('Thesis Allowance')
          .upsert(
          {
            spas_id: data.spas_id,
            type: data.type,
            abstract_thesis_file_key: data.abstract_thesis_file_key,
            approval_file_key: data.approval_file_key,
            final_thesis_file_key: data.final_thesis_file_key,
            comment: null,
            created_at: new Date().toISOString(),
            status: 'Pending',
          },
          );

          if (supabaseError) {
            throw new Error(supabaseError.message);
          }
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Supabase Thesis Upload Error:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitThesis, loading, error, success };
};