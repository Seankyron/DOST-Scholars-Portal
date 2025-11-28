import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Json } from '@/lib/supabase/type';
import { data } from 'jquery';


export interface SubmissionData {
  spas_id: string;
  new_course?: string | null;
  new_school?: string | null;
  effectivity_of_shifting: string;
  ojt: Json;
  reason: string;
  application_form_file_key?: string | null;
  admission_cert_file_key?: string | null;
  accredited_sub_file_key?: string | null;
  new_year_level_file_key?: string | null;
  all_grades_file_key?: string | null;
  approved_pos_file_key?: string | null;
  type?: string | null;
}

export const useSubmitShifting = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitShifting = useCallback(async (data: SubmissionData, id: number | null) => {
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (id === null) {
        const { data:insertedData, error} = await supabase 
          .from('Shifting Course')
          .insert({
            spas_id: data.spas_id,
            new_course: data.new_course,
            new_school: data.new_school,
            effectivity_of_shifting: data.effectivity_of_shifting,
            ojt: data.ojt,
            reason: data.reason,
            application_form_file_key: data.application_form_file_key,
            admission_cert_file_key: data.admission_cert_file_key,
            accredited_sub_file_key: data.accredited_sub_file_key,
            new_year_level_file_key: data.new_year_level_file_key,
            all_grades_file_key: data.all_grades_file_key,
            approved_pos_file_key: data.approved_pos_file_key,
            type: data.type
          })
          .select()
          .single();

        if (error) { throw new Error(error?.message); }

        setSuccess(true);
        return insertedData;
      }
      else {
        const { data:updatedData, error } = await supabase
          .from('Shifting Course')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if(error) { throw new Error(error.message); }

        setSuccess(true);
        return updatedData;
      }
    }
    catch (err: any) {
      setError(err.message || 'An unknown error occured.');
      return null;
    }
  }, []);

  return { submitShifting, error, success };
}