import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PTPTransactionType } from "@/components/scholar/services/PracticalTraining/PracticalTrainingPanel";

export interface PTPReferralData {
  id: string;
  spas_id: string;
  plan: string;
  reply_slip_file_key?: string | null;
  curriculum_file_key?: string | null;
  status: string;
  created_at: string;
  comment?: string | null;
}

export interface PTPCompletionData {
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

// Union type for the return data
export type PTPData = PTPReferralData | PTPCompletionData | null;

export function useCurrentScholarPTP(type: PTPTransactionType) {
  const [data, setData] = useState<PTPData>(null);
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

        // Select the correct table based on the Type
        query = supabase
          .from('PTP Submission')
          .select('*')
          .eq('spas_id', user.spas_id)
          .eq('type', type)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { data: result, error } = await query;

        if (error) throw error;

        setData(result as PTPData);
      } catch (err: any) {
        console.error("Error fetching PTP data:", err);
        setError(err.message || "Unknown error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  });

  return { data, loading, error };
}