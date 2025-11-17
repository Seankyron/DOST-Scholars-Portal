import { createServerClient } from '@supabase/ssr';
import { type Database } from '@/lib/supabase/type';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  // Sign out the user
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout Error:', error);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }

  // Return a success response, and the client will handle the redirect
  return NextResponse.json({ success: true, redirectTo: '/login' });
}