import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface SubmissionData {
  spas_id?: string | null;
  type?: string | null;
  reason?: string | null;
  comment?: string | null;
  status?: string | null;
  attachment?: string | null;
  updated_at?: string | null;
}

export function useSubmitFeedback() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitFeedback = useCallback(async (data: SubmissionData, id: number | null) => {
    const supabase = createClient();

    try {
      if (!id) {
        if (!data.spas_id || !data.type || !data.reason) {
          throw new Error("Missing required fields: spas_id, type, or reason");
        }

        const { error } = await supabase  
          .from('Scholar Support and Feedback Mechanism')
          .insert({
            spas_id: data.spas_id as string,
            type: data.type as string,
            reason: data.reason as string,
            comment: data.comment,
            status: data.status,
            attachment: data.attachment,
            updated_at: data.updated_at,
            created_at: new Date().toISOString()
          });
        
        if (error) { throw new Error(error.message); }
        setSuccess(true);
      }
      else {
        const { error } = await supabase 
          .from("Scholar Support and Feedback Mechanism")
          .update({
            ...data,
            spas_id: data.spas_id ?? undefined,
            type: data.type ?? undefined,
            reason: data.reason ?? undefined,
          })
          .eq('id', id);

        if (error) { throw new Error(error.message); }
        setSuccess(true);
      }
    }
    catch (err: any) {
      setError(err.message);
      setSuccess(false); 
    }
  }, []);

  return { submitFeedback, success, error };
}