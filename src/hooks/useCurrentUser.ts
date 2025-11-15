import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();

      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        setUser(null);
      } else {
        setUser(session.user);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, loading };
}
