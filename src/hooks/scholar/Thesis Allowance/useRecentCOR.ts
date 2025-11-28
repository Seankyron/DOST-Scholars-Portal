import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; 

// Helper to implement your specific weighting logic
const getSemesterWeight = (semester: string | null) => {
  switch (semester) {
    case 'Midyear': return 3;
    case '2nd Semester': return 2;
    case '1st Semester': return 1;
    default: return 0;
  }
};

export function useRecentCOR(spas_id: string | undefined) {
  const [recentGradeKey, setRecentGradeKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spas_id) {
      setLoading(false);
      return;
    }

    const fetchRecentCOR = async () => {
      const supabase = createClient();

      try {
        // 1. Fetch all submissions for this user that have a file
        const { data, error } = await supabase
          .from('Grade Submission')
          .select('cor_file_key, semester, year_level')
          .eq('spas_id', spas_id)
          .not('cor_file_key', 'is', null);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // 2. Apply your custom sorting logic in JavaScript
          const sortedData = data.sort((a, b) => {
            // First, compare Year Level (DESC)
            if ((b.year_level || 0) !== (a.year_level || 0)) {
              return (b.year_level || 0) - (a.year_level || 0);
            }
            
            // Second, compare Semester Weight (DESC)
            return getSemesterWeight(b.semester) - getSemesterWeight(a.semester);
          });

          // 3. Pick the top one (Most Recent)
          setRecentGradeKey(sortedData[0].cor_file_key);
        }
      } catch (err: any) {
        console.error('Error fetching recent grade:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCOR();
  }, [spas_id]);
  return { recentGradeKey, loading, error };
}