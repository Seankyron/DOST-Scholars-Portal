import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Ensure this path matches your project

export function useMonthlyData(tableName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default to current month and year
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // 1. Calculate Start Date (1st of current month)
      const startDate = new Date(year, month, 1).toISOString();

      // 2. Calculate End Date (1st of NEXT month)
      const endDate = new Date(year, month + 1, 1).toISOString();

      try {
        const { data: result, error: supabaseError } = await supabase
          .from(tableName)
          .select('*')
          .gte('created_at', startDate) // Greater than or equal to Start
          .lt('created_at', endDate)    // Less than End (Start of next month)
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;
        setData(result);
      } catch (err) {
        console.error(`Error fetching ${tableName}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, month, year]); // Re-run when month/year changes

  return { data, loading, error, month, year, setMonth, setYear };
}