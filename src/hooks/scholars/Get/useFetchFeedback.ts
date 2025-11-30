import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface iFeedback {
  id: number;
  spas_id?: string | null;
  type?: string | null;
  reason?: string | null;
  comment?: string | null;
  status?: string | null;
  attachment?: string | null;
  updated_at?: string | null;
}

export function useFetchFeedback(spas_id: string, length: number = 0) {
  const [data, setData] = useState<iFeedback[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const supabase = createClient();
  
        const { data, error } = await supabase
          .from('Scholar Support and Feedback Mechanism')
          .select(`id, spas_id, type, reason, comment, status, attachment, updated_at`)
          .eq('spas_id', spas_id)
          .order('updated_at', { ascending: false })
          .limit(length);
          
        if (error) { throw new Error(error.message); }
  
        setData(data);
        setSuccess(true);
      }
      catch (err: any) {
        setError(err.message);
        setSuccess(false);
      }
    }
    fetchFeedback();
  }, []);

  return { data, success, error };
}