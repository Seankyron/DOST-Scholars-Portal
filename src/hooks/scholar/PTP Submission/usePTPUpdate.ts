import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/type';

// Define the exact shape based on your table Row to ensure type safety
type PTPSubmissionUpdate = Database['public']['Tables']['PTP Submission']['Update'];

export const useUpdatePTP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // We accept a Partial object because we might only update specific fields
  const updatePTP = useCallback(async (data: PTPSubmissionUpdate & { id: number }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (!data.id) throw new Error("Update failed: Missing Submission ID");

      // 1. Prepare the payload
      // We explicitly filter out undefined values to ensure we don't accidentally nullify DB fields
      // However, supabase .update() handles omitted keys correctly by ignoring them.
      
      const payload: PTPSubmissionUpdate = {
        created_at: new Date().toISOString(), // Good practice to track updates
        status: data.status,
      };

      // Add fields only if they exist in the incoming data
      if (data.plan !== undefined) payload.plan = data.plan;
      if (data.grade_file_key !== undefined) payload.grade_file_key = data.grade_file_key;
      if (data.reply_slip_file_key !== undefined) payload.reply_slip_file_key = data.reply_slip_file_key;
      
      if (data.form_126_file_key !== undefined) payload.form_126_file_key = data.form_126_file_key;
      if (data.form_127_file_key !== undefined) payload.form_127_file_key = data.form_127_file_key;
      if (data.form_128_file_key !== undefined) payload.form_128_file_key = data.form_128_file_key;
      if (data.dtr_file_key !== undefined) payload.dtr_file_key = data.dtr_file_key;
      if (data.training_completion_file_key !== undefined) payload.training_completion_file_key = data.training_completion_file_key;

      // 2. Perform the Update
      const { error: supabaseError } = await supabase
        .from('PTP Submission')
        .update(payload)
        .eq('id', data.id); // Strictly match by ID

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Supabase Update Error:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { updatePTP, loading, error, success };
};