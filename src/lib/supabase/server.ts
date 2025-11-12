// src/lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        // --- FIX IS HERE ---
        // Make the 'get' function async
        async get(name: string) {
          // Await the cookieStore promise to get the actual store
          const store = await cookieStore;
          return store.get(name)?.value;
        },

        // --- AND HERE ---
        // Make the 'set' function async
        async set(name: string, value: string, options: CookieOptions) {
          // Await the cookieStore promise
          const store = await cookieStore;
          try {
            store.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // the session cookies.
          }
        },

        // --- AND HERE ---
        // Make the 'remove' function async
        async remove(name: string, options: CookieOptions) {
          // Await the cookieStore promise
          const store = await cookieStore;
          try {
            store.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // the session cookies.
          }
        },
      },
    }
  );
};