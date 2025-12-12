import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from '@/lib/supabase/type';

export type RequestFormData = Database['public']['Tables']['Request Forms']['Row'];

// Accept an optional trigger (number)
export function useCurrentRequest(refreshTrigger?: number) {
  const [data, setData] = useState<RequestFormData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const userString = sessionStorage.getItem('user');

      if (!userString) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(userString);

      if (!user.spas_id) {
        setError('Error: Scholar SPAS ID is not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Reset loading state on refresh
        const { data: result, error } = await supabase
          .from('Request Forms')
          .select('*')
          .eq('spas_id', user.spas_id)
          .order('requested_at', { ascending: false });

        if (error) throw error;

        setData(result);
      } catch (err: any) {
        console.error("Error fetching Request Forms data:", err);
        setError(err.message || "Unknown error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Add refreshTrigger to dependencies
  }, [refreshTrigger]); 

  return { data, loading, error };
}