'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Scholar } from '@/types';
import { useAuth } from './useAuth';

export function useScholar() {
  const { user } = useAuth();
  const [scholar, setScholar] = useState<Scholar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchScholar = async () => {
      try {
        const { data, error } = await supabase
          .from('scholars')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error) throw error;
        setScholar(data as Scholar);
      } catch (err) {
        console.error('Error fetching scholar:', err);
        setError('Failed to load scholar data');
      } finally {
        setLoading(false);
      }
    };

    fetchScholar();
  }, [user]);

  const refetchScholar = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scholars')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) throw error;
      setScholar(data as Scholar);
    } catch (err) {
      console.error('Error refetching scholar:', err);
      setError('Failed to reload scholar data');
    } finally {
      setLoading(false);
    }
  };

  return {
    scholar,
    loading,
    error,
    refetchScholar,
  };
}
