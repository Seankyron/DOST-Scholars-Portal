import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ThesisPercentage } from "@/components/scholar/services/ThesisAllowance/ThesisAllowancePanel"; 

export interface Thesis90 {
  id: string;
  spas_id: string;
  plan: string;
  reply_slip_file_key?: string | null;
  curriculum_file_key?: string | null;
  status: string;
  created_at: string;
  comment?: string | null;
}

export interface Thesis10 {
  id: string;
  spas_id: string;
  plan: string;
  form_126_file_key?: string | null;
  form_127_file_key?: string | null;
  form_128_file_key?: string | null;
  dtr_file_key?: string | null;
  training_completion_file_key?: string | null;
  status: string;
  created_at: string;
  comment?: string | null;
}

export interface Thesis100 {
  id: string;
  spas_id: string;
  plan: string;
  reply_slip_file_key?: string | null;
  curriculum_file_key?: string | null;
  status: string;
  created_at: string;
  comment?: string | null;
}

export type ThesisData = Thesis90 | Thesis10 | Thesis100 | null;

export function useCurrentThesis(type: ThesisPercentage) {
  const [data, setData] = useState<ThesisData | null>(null);
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
        let query;

        query = supabase
          .from('Thesis Allowance')
          .select('*')
          .eq('spas_id', user.spas_id)
          .eq('type', type)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { data: result, error } = await query;

        if (error) throw error;

        setData(result as ThesisData);
      } catch (err: any) {
        console.error("Error fetching Thesis data:", err);
        setError(err.message || "Unknown error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}