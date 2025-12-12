// src/hooks/scholar/Request Forms/useRequestUpload.ts
import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface RequestUploadPayload {
  spas_id: string;
  requested_document: string;
  reason: string;
  file_key?: string | null; // Assumes a column exists for the file
}

export const useRequestUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitRequest = useCallback(async (data: RequestUploadPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      // We use .insert() to create a NEW record every time (Transactional)
      const { error: supabaseError } = await supabase
        .from('Request Forms')
        .insert({
          spas_id: data.spas_id,
          requested_document: data.requested_document,
          reason: data.reason,
          status: 'Pending',
          requested_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          comment: '',
          // Note: Ensure your Supabase 'Request Forms' table has a 'file_key' column
          // @ts-ignore 
          file_key: data.file_key || null, 
        });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Supabase Request Upload Error:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitRequest, loading, error, success };
};