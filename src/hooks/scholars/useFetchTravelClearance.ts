import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';


interface iTravelClearance {
  id: string;
  spas_id: string;
  departure: string;
  arrival: string;
  request_letter_file_key: string;
  guarantee_letter_file_key?: string | null;
  completed_request_form_file_key: string;
  cause_of_submission_delay?: string | null;
  requested_at: string;
  updated_at: string;
  status: string;
  deed_of_undertaking_file_key?: string | null;
  employment_file_key?: string | null;
  valid_id_file_key?: string | null;    
  type?: string | null;
  destination?: string | null;
}

export function useFetchTravelClearance (spas_id: string) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<iTravelClearance[] | null>(null);

  useEffect(() => {
    const fetchTravelClearance = async () => {
      const supabase = createClient();

      try {
        const { data, error } = await supabase 
          .from('Travel Clearance')
          .select(`id, spas_id, departure, arrival, request_letter_file_key,
                  guarantee_letter_file_key, completed_request_form_file_key,
                  cause_of_submission_delay, requested_at, updated_at,
                  status, deed_of_undertaking_file_key, employment_file_key,
                  valid_id_file_key, type, destination`)
          .eq('spas_id', spas_id);
        
        if (error) throw new Error(error.message);

        setData(data as unknown as iTravelClearance[]);
        setSuccess(true);
      }
      catch (err: any) {
        setError(err.message || 'Unknown error.');
        setData(null);
        setSuccess(false);
      }
    }
    fetchTravelClearance();
  }, []);

  return { data, success, error };
};