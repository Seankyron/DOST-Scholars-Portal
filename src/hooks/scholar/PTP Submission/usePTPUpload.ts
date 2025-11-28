import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';


interface SubmissionData {
  id: number;
  spas_id: string;
  plan?: string | null;
  grade_file_key?: string | null;
  reply_slip_file_key?: string | null;
  dtr_file_key?: string | null;
  form_126_file_key?: string | null;
  form_127_file_key?: string | null;
  form_128_file_key?: string | null;
  training_completion_file_key?: string | null;
  comment?: string | null;
  created_at?: string | null;
  type: string;
}

export const useSubmitPTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

 
  const submitGrade = useCallback(async (data: SubmissionData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient(); 

    try {
        if (data.type == 'Referral Letter') {
            const { error: supabaseError } = await supabase
                .from('PTP Submission')
                .upsert(
                {
                    id: data.id,
                    spas_id: data.spas_id,
                    plan: data.plan,
                    type: data.type,
                    reply_slip_file_key: data.reply_slip_file_key,
                    created_at: data.created_at ?? new Date().toISOString(),
                    comment: null,
                },
                );
        
            if (supabaseError) {
                throw new Error(supabaseError.message);
            }
    }

        else if (data.type == 'Program Completion') {
            const { error: supabaseError } = await supabase
                .from('PTP Submission')
                .upsert(
                {
                    id: data.id, 
                    spas_id: data.spas_id,
                    type: data.type,
                    dtr_file_key: data.dtr_file_key,
                    training_completion_file_key: data.training_completion_file_key,
                    form_126_file_key: data.form_126_file_key,
                    form_127_file_key: data.form_126_file_key,
                    form_128_file_key: data.form_126_file_key,
                    created_at: data.created_at ?? new Date().toISOString(),
                },
                );
        
            if (supabaseError) {
                throw new Error(supabaseError.message);
            }
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