import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Json } from '@/lib/supabase/type';
import { setErrorMap } from 'zod/v3';


export interface SubmissionData {
  spas_id: string;
  type: string;
  LOA_form_file_key?: string | null;
  required_document_file_key?: Json | null;
  updated_at?: string | null;
  status?: string | null;
  semester?: string | null;
  academic_year?: string | null;
  duration?: string | null;
  reason?: string | null;
  comment?: string | null;
}

export const useSubmitLoa = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitLoa = useCallback(async (data: SubmissionData, id: number | null) => {
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (!id) {
        const { error } = await supabase
          .from('Leave of Absence')
          .insert({
            spas_id: data.spas_id,
            created_at: new Date().toISOString(),
            LOA_form_file_key: data.LOA_form_file_key,
            required_document_file_key: data.required_document_file_key,
            updated_at: data.updated_at,
            status: data.status,
            semester: data.semester,
            academic_year: data.academic_year,
            duration: data.duration,
            reason: data.reason,
            comment: data.comment,
            type: data.type
          });
        
        if (error) { throw new Error(error.message); }
        setSuccess(true);
      }
      else {
        const { error } = await supabase
          .from('Leave of Absence')
          .update(data);

        if (error) { throw new Error(error.message); }
        setSuccess(true);
      }
    }
    catch (err: any) {
      setError(err.message);
      setSuccess(false);
    }
  }, []);

  return { submitLoa, success, error };
}