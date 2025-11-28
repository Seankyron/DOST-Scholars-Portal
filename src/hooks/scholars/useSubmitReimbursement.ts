import { useState, useCallback } from "react";
import { createClient } from '@/lib/supabase/client';


export interface SubmissionData {
  type: string;
  spas_id: string;
  amount?: number | null;
  reason?: string | null;
  status?: string | null;
  updated_at?: string | null;
  receipt_file_key?: string | null;
}

export const useSubmitReimbursement = () => {
  const [ error, setError ] = useState<string | null>(null);
  const [ success, setSuccess ] = useState(false);

  const submitReimbursement = useCallback(async (data: SubmissionData, id: number | null) => {
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (!id) {
        const { data:insertedData, error } = await supabase
          .from('Reimbursement')
          .insert({
            type: data.type,
            amount: data.amount,
            reason: data.reason,
            status: data.status,
            spas_id: data.spas_id,
            receipt_file_key: data.receipt_file_key,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (error) { throw new Error(error.message); }

        setSuccess(true);
        return insertedData;
      }
      else {
        const { data:updatedData, error } = await supabase
          .from('Reimbursement')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) { throw new Error(error.message); }

        setSuccess(true);
        return updatedData;
      }
    }
    catch (err: any) {
      setError(err.message || 'Unknown error has occured.');
      return null;
    }
  }, []);

  return { submitReimbursement, error, success };
}