import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/type';

type ThesisUpdate = Database['public']['Tables']['Thesis Allowance']['Update'];

// Extend the input type to optionally include cor_file_key manually
// in case the Database type definition hasn't been regenerated yet.
interface ExtendedThesisUpdate extends ThesisUpdate {
  cor_file_key?: string | null;
}

export const useUpdateThesis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateThesis = useCallback(async (data: ExtendedThesisUpdate & { id: number }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (!data.id) throw new Error("Update failed: Missing Submission ID");

      // Prepare Payload
      // We cast to 'any' temporarily if the DB types aren't updated yet to include cor_file_key
      const payload: any = {};

      // Conditionally add fields to payload
      if (data.abstract_thesis_file_key !== undefined) payload.abstract_thesis_file_key = data.abstract_thesis_file_key;
      if (data.approval_file_key !== undefined) payload.approval_file_key = data.approval_file_key;
      if (data.final_thesis_file_key !== undefined) payload.final_thesis_file_key = data.final_thesis_file_key;
      
      // --- NEW: Add COR File Key ---
      if (data.cor_file_key !== undefined) payload.cor_file_key = data.cor_file_key;

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