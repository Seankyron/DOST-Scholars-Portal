import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/type';

type ThesisUpdate = Database['public']['Tables']['Thesis Allowance']['Update'];

export const useUpdateThesis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateThesis = useCallback(async (data: ThesisUpdate & { id: number }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (!data.id) throw new Error("Update failed: Missing Submission ID");

      // Prepare Payload
      const payload: ThesisUpdate = {
        status: 'Pending', // Reset status on update
        // No 'updated_at' field in the 'Update' type provided in type.ts, 
        // but if your DB has it via trigger, you don't need to send it.
        // If schema has it, add: updated_at: new Date().toISOString(),
      };

      // Conditionally add fields to payload
      if (data.abstract_thesis_file_key !== undefined) payload.abstract_thesis_file_key = data.abstract_thesis_file_key;
      if (data.approval_file_key !== undefined) payload.approval_file_key = data.approval_file_key;
      if (data.final_thesis_file_key !== undefined) payload.final_thesis_file_key = data.final_thesis_file_key;
      
      // Allow updating the type (e.g., upgrading from 90% record to 10% claim)
      if (data.type !== undefined) payload.type = data.type;

      const { error: supabaseError } = await supabase
        .from('Thesis Allowance')
        .update(payload)
        .eq('id', data.id);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Supabase Thesis Update Error:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateThesis, loading, error, success };
};