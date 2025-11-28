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

export function useFetchGrades(spasId: string, year: number | null = null, semester: string | null = null) 
{
  const [grade, setGrade] = useState<iGradeSubmissions[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrade = async () => {
      const supabase = createClient();

      try {
        const query = supabase
            .from('Grade Submission')
            .select('id, year_level, semester, grade_file_key, cor_file_key, status, updated_at, comment')
            .eq('spas_id', spasId);
        
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