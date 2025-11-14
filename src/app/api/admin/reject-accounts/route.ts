import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase URL or Service Role Key' },
      { status: 500 }
    );
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { userIds }: { userIds: string[] } = await request.json();

  if (!userIds || userIds.length === 0) {
    return NextResponse.json({ error: 'No user IDs provided' }, { status: 400 });
  }

  const results = await Promise.all(
    userIds.map(async (id) => {
      try {
        // 1. Delete the user from auth.users
        // Assuming 'on delete cascade' is set, this
        // will also delete their 'public.User' row.
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