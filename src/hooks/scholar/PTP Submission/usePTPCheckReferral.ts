import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function usePTPSubmission(spas_id: string | undefined) {
  const [hasReferral, setHasReferral] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spas_id) {
      setLoading(false);
      return;
    }

    const checkReferral = async () => {
      const supabase = createClient();
      try {
        // Check if a Referral Letter record exists for this scholar
        const { data, error } = await supabase
          .from('PTP Submission')
          .select('id')
          .eq('type', 'Referral')
          .limit(1)

        if (error) throw error;

        setHasReferral(!!data); // True if data exists, False if null
      } catch (err: any) {
        console.error('Error checking PTP submission:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkReferral();
  }, [spas_id]);

  return { hasReferral, loading, error };
}