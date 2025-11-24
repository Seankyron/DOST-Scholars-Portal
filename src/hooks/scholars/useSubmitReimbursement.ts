import { useState, useCallback } from "react";
import { createClient } from '@/lib/supabase/client';
import { setSourceMapsEnabled } from "process";
import { set } from "date-fns";


export interface SubmissionData {
  spas_id: string;
  type: string;
  reason?: string | null;
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
            spas_id: data?.spas_id,
            type: data.type,
            reason: data.reason,
            receipt_file_key: data.receipt_file_key,
            created_at: new Date().toISOString()
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