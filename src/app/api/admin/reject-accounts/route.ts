import { createServerClient } from '@supabase/ssr'; // <-- CHANGED
import { type Database } from '@/lib/supabase/type';
import { cookies } from 'next/headers'; // <-- ADDED
import { NextResponse } from 'next/server';

// We NO LONGER need the service role key here.
// const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  const cookieStore = await cookies(); // <-- ADDED
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  console.log(cookieStore);
  
  if (!supabaseUrl) {
    return NextResponse.json(
      { error: 'Missing Supabase URL' },
      { status: 500 }
    );
  }

  // Create a new client in the context of the logged-in user
  const supabase = createServerClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { userIds }: { userIds: string[] } = await request.json();

  if (!userIds || userIds.length === 0) {
    return NextResponse.json({ error: 'No user IDs provided' }, { status: 400 });
  }

  const results = await Promise.all(
    userIds.map(async (id) => {
      try {
        const { error: authError } =
          await supabase.auth.admin.deleteUser(id);
        
        if (authError) throw new Error(`Auth Error: ${authError.message}`);

        // TODO: Send a "Registration Rejected" email
        // await sendRejectionEmail(userEmail);

        return { id, success: true };
      } catch (err: any) {
        return { id, success: false, error: err.message };
      }
    })
  );

  return NextResponse.json({ results });
}