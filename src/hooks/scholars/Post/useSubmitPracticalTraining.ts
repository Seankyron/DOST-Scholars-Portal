import { useState, useCallback } from "react";
import { createClient } from '@/lib/supabase/client';


export interface SubmissionData {
  spas_id: string;
  dtr_file_key?: string | null;
  form_126_file_key?: string | null;
  form_127_file_key?: string | null;
  form_128_file_key?: string | null;
  reply_slip_file_key?: string | null;
  grade_file_key?: string | null;
  training_completion_file_key?: string | null;
  plan?: string | null;
  comment?: string | null;
  type: string;
  status: string;
  updated_at?: string | null;
}

export const useSubmitPraticalTraining = () => {
  const [ error, setError ] = useState<string | null>(null);
  const [ success, setSuccess ] = useState(false);

  const submitPracticalTraining = useCallback(async (data: SubmissionData, id: number | null) => {
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (!id) {
        const { error } = await supabase 
          .from('PTP Submission')
          .upsert({
            spas_id: data.spas_id,
            dtr_file_key: data.dtr_file_key,
            form_126_file_key: data.form_126_file_key,
            form_127_file_key: data.form_127_file_key,
            form_128_file_key: data.form_128_file_key,
            reply_slip_file_key: data.reply_slip_file_key,
            grade_file_key: data.grade_file_key,
            training_completion_file_key: data.training_completion_file_key,
            plan: data.plan,
            comment: data.comment,
            type: data.type,
            created_at: new Date().toISOString(),
            updated_at: data.updated_at
          });
        
        if (error) { throw new Error(error.message); }

        setSuccess(true);
      }
      else {
        const { data:updatedData, error } = await supabase 
          .from('PTP Submission')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) { throw new Error(error.message); }

        setSuccess(true);
        return updatedData;
      }
    }
    catch (err: any) {
      console.log(err.message);
      console.log(err.cause);
      setError(err.message || 'Unknown error.');
      return null;
    }
  }, []);

  return { submitPracticalTraining, error, success };
}