import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Json } from '@/lib/supabase/type';


interface iShifting {
  id: number;
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
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export function useFetchShifting(spas_id:string, length: number) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<iShifting[] | null>(null);

  useEffect(() => {
    const fetchShifting = async () => {
      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from('Shifting Course')
          .select(`id, spas_id, new_course, new_school, effectivity_of_shifting,
                  ojt, reason, application_form_file_key, admission_cert_file_key,
                  accredited_sub_file_key, new_year_level_file_key, 
                  all_grades_file_key, approved_pos_file_key, type, status,
                  created_at, updated_at`)
          .eq('spas_id', spas_id)
          .order('updated_at', { ascending: false })
          .limit(length);
        
        if (error) throw new Error(error.message);

        setData(data as unknown as iShifting[]);
        setSuccess(true);
      }
      catch (err: any) {
        setError(err.message || 'Unknown error.');
        setData(null);
        setSuccess(false);
      }
    }
    fetchShifting();
  }, []);

  return { data, success, error };
}