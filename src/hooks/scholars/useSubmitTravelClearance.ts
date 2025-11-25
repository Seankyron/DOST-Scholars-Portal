import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface SubmissionData {
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

export const useSubmitTravelClearance = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitTravelClearance = useCallback(async (data: SubmissionData,  id: number | null) => {
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    try {
      if (id === null) {
        const { data:insertedData, error } = await supabase 
          .from('Travel Clearance')
         .insert({
            spas_id: data.spas_id,
            departure: data.departure,
            arrival: data.arrival,
            request_letter_file_key: data.request_letter_file_key,
            guarantee_letter_file_key: data.guarantee_letter_file_key,
            completed_request_form_file_key: data.completed_request_form_file_key,
            cause_of_submission_delay: data.cause_of_submission_delay,
            requested_at: data.requested_at,
            updated_at: data.updated_at,
            status: data.status,
            deed_of_undertaking_file_key: data.deed_of_undertaking_file_key,
            employment_file_key: data.employment_file_key,
            valid_id_file_key: data.valid_id_file_key,
            type: data.type,
            destination: data.destination
          })
          .select()
          .single();
        
        if (error) { throw new Error(error?.message); }

        setSuccess(true);
        return insertedData;
      } 
      else {
        const { data: updatedRow, error:updateError } = await supabase
          .from('Travel Clearance')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (updateError) { throw new Error(updateError.message); }
        
        setSuccess(true);
        return updatedRow;
      }
    } 
    catch (err: any) {
      setError(err.message || 'An unknown error occured.');
      return null;
    }
  }, []);

  return { submitTravelClearance, error, success}
}