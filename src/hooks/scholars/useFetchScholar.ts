import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LargeNumberLike } from "crypto";
import { Json } from "@/lib/supabase/type";


export interface Scholar {
  id: string;
  spas_id: string;
  created_at: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix?: string | null;
  contact_number: string;
  date_of_birth: string;
  address?: string | null;
  municipality_city?: string | null;
  province: string;
  scholarship_type: string;
  year_awarded: string;
  university: string;
  program_course: string;
  course_duration: number;
  thesis_year: number;
  ojt?: Json | null;
  curriculum_file_key: string;
  scholarship_status: string;
  is_verified: boolean;
  midyear_classes?: number[] | null;
  email: string;
}

export function useFetchScholar() {
  const [user, setUser] = useState<Scholar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session?.user?.id) {
          setUser(null);
          setLoading(false);
          return;
        }

        const userId = session.user.id;

        const { data: userData, error: userError } = await supabase
          .from("User") // lowercase table name
          .select("*")
          .eq("id", userId)
          .single();

        if (userError) throw userError;

        setUser(userData);
      } catch (err: any) {
        console.error("Error fetching current user:", err);
        setError(err.message || "Unknown error");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}