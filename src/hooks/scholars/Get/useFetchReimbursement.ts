import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';


interface iReimbursement {
  id: number;
  type: string;
  amount: number;
  status: string; 
  spas_id: string;
  updated_at: string;
  reason?: string | null;
  receipt_file_key?: string | null;
}

export function useFetchReimbursement(spas_id: string, length: number) {
  const [data, setData] = useState<iReimbursement[] | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReimbursement = async () => {
      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from('Reimbursement')
          .select(`id, type, amount, status, spas_id, updated_at, reason, receipt_file_key`)
          .limit(length)
          .order('updated_at', { ascending: false});

        if (error) { throw new Error(error.message); }

        setData(data as unknown as iReimbursement[]);
        setSuccess(true);
      }
      catch (err: any) {
        setError(err.message);
        setData(null);
        setSuccess(false);
      }
    }
    fetchReimbursement();
  }, []);  

  return { data, success, error };
}