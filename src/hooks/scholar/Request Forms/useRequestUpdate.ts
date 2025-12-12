// src/hooks/scholar/Request Forms/useRequestUpdate.ts
import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/type';

type RequestUpdate = Database['public']['Tables']['Request Forms']['Update'];

export const useRequestUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateRequest = useCallback(async (data: RequestUpdate & { id: number; file_key?: string | null }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (!data.id) throw new Error("Update failed: Missing Request ID");

      const payload: RequestUpdate & { file_key?: string | null } = {
        updated_at: new Date().toISOString(),
      };

      if (data.reason !== undefined) payload.reason = data.reason;
      if (data.status !== undefined) payload.status = data.status;
      // @ts-ignore: Handle file_key update if schema supports it
      if (data.file_key !== undefined) payload.file_key = data.file_key;

      const { error: supabaseError } = await supabase
        .from('Request Forms')
        .update(payload)
        .eq('id', data.id);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Supabase Request Update Error:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateRequest, loading, error, success };
};