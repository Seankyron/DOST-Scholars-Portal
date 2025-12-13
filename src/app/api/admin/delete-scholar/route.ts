import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Setup Admin Client with Service Role Key
  // We need the service role key to manage Auth users
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase URL or Service Role Key' },
      { status: 500 }
    );
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Scholar ID is required' },
        { status: 400 }
      );
    }

    // 2. Delete from Supabase Auth
    // This removes the user's login access.
    // NOTE: If your public.User table is set to ON DELETE CASCADE from auth.users,
    // this will also attempt to delete the profile.
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      console.error('Auth Delete Error:', authError);
      throw new Error(`Auth Error: ${authError.message}`);
    }

    // 3. Delete from public.User table
    // We explicitly attempt to delete the profile to ensure cleanup.
    // This keeps the referenced records (like Grades) intact, provided the DB allows orphaned records
    // or has ON DELETE SET NULL configured.
    const { error: dbError } = await supabase
      .from('User')
      .delete()
      .eq('id', id);

    // If the error is "Row not found", it's likely because the Auth delete already cascaded.
    // We only throw if it's a different error.
    if (dbError && dbError.code !== 'PGRST116') {
      console.error('Database Delete Error:', dbError);
      throw new Error(`Database Error: ${dbError.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete Scholar Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}