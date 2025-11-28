import { use, useEffect, useState } from "react";
import { createClient } from '@/lib/supabase/client';


interface iPtp {
  id: number;
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
  created_at: string;
  updated_at: string;
}

export function useFetchPracticalTraining(spas_id: string, length: number) {
  const [data, setData] = useState<iPtp[] | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPtp = async () => {
      const supabase = createClient();
  
      try {
        const { data, error } = await supabase
          .from('PTP Submission')
          .select(`id, spas_id, dtr_file_key, form_126_file_key, form_127_file_key, form_128_file_key,
                  reply_slip_file_key, grade_file_key, training_completion_file_key, plan,
                  comment, type, status, created_at, updated_at`)
          .eq('spas_id', spas_id)
          .limit(length)
          .order('updated_at', { ascending: false });

        if(error) { throw new Error(error.message); }

        setData(data as unknown as iPtp[]);
        setSuccess(true);
      }
      catch (err: any) {
        setError(err.message);
        setData(null);
        setSuccess(false);
      }
    }
    fetchPtp();
  }, []);

  return { data, success, error };
}