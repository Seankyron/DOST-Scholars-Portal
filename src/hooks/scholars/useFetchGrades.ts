import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";


export interface iGradeSubmissions {
  id: number;
  year_level: number;
  semester: string;
  grade_file_key?: string | null;
  cor_file_key?: string | null;
  status: string;
  updated_at: string;
  comment?: string | null;
}

export function useFetchGrades(year: number | null = null, semester: string | null = null) 
{
  const [grade, setGrade] = useState<iGradeSubmissions[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrade = async () => {
      const supabase = createClient();
      const userString = sessionStorage.getItem('user');

      if (!userString) {
        setError("No user found in session.");
        setLoading(false);
        return;
      }
      const user = JSON.parse(userString);

      if (!user.spas_id) {
        setError('Error: Scholars SPAS ID is not found.');
        setLoading(false);
        return;
      }

      try {
        const query = supabase
            .from('Grade Submission')
            .select('id, year_level, semester, grade_file_key, cor_file_key, status, updated_at, comment')
            .eq('spas_id', user.spas_id);
        
        if (year) query.eq('year_level', year);
        if (semester) query.eq('semester', semester);
        
        const { data, error } = await query;

        if (error) throw error;

        setGrade(data as iGradeSubmissions[] ?? []);
      }
      catch (err: any) {
        setError(err.message || "Unknown error");
        setGrade(null);
      } finally {
        setLoading(false);
      }
    }
    fetchGrade();
  }, []);

  return { grade: grade ?? [], loading, error };
}
