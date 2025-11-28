import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Json } from '@/lib/supabase/type';


interface iLoa {
  id: number;
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

export function useFetchLoa(spas_id: string, length: number = 0) {
  const [data, setData] = useState<iLoa[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchLoa = async() => {
      const supabase = createClient();

      try {
        const {data, error} = await supabase
          .from('Leave of Absence')
          .select(`id, spas_id, type, LOA_form_file_key, required_document_file_key,
                  updated_at, status, semester, academic_year, duration, reason, comment`)
          .eq('spas_id', spas_id)
          .limit(length)
          .order('updated_at', { ascending: false} );

        if (error) { throw new Error(error.message); }

        setData(data as unknown as iLoa[]);
        setSuccess(true);
      }
      catch (err: any) {
        setError(err.message);
        setSuccess(false);
        setData(null);
      }
    }
    fetchLoa();
  }, []);

  return {data, success, error};
}