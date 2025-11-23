import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Json } from "@/lib/supabase/type";


interface iStipend {
  id: string;
  spas_id: string;
  year_level: number;
  semester: number;
  stipend_type: string;
  received: number;
  unreleased: number;
  status: string;
  grade_submission_id?: string | null;
  allowance_breakdown?: Json | null;
}

export function useFetchStipend(spas_id: string)
{
  const [stipend, setStipend] = useState<iStipend[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStipend = async () => {
      const supabase = createClient();
      
      try {
        const query = supabase
            .from('Stipend Tracking')
            .select(`id, spas_id, year_level, semester, 
              stipend_type, received, unreleased, status, 
              grade_submission_id, allowance_breakdown`)
            .eq('spas_id', spas_id)
        
        const { data, error } = await query;

        if (error) throw error;

        setStipend(data as unknown as iStipend[]);
      }
      catch (err: any) {
        setError(err.message || 'Unknown Error');
        setStipend(null);
      }
      finally {
        setLoading(false);
      }
    }
    fetchStipend();
  }, []);

  return { stipend: stipend, loading, error };
}
