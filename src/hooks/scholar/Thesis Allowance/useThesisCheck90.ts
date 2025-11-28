import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useThesisCheck90(spas_id: string | undefined) {
  const [has90, setHas90] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spas_id) {
      setLoading(false);
      return;
    }

    const check90 = async () => {
      const supabase = createClient();
      try {
        // Check if a Referral Letter record exists for this scholar
        const { data, error } = await supabase
          .from('Thesis Allowance')
          .select('id')
          .eq('type', '90%')
          .limit(1)

        if (error) throw error;

        setHas90(!!data); // True if data exists, False if null
      } catch (err: any) {
        console.error('Error checking PTP submission:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    check90();
  }, [spas_id]);

  return { has90, loading, error };
}