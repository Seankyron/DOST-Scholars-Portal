import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';

// These are your secret server-side keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Server configuration error: Missing Supabase credentials' },
      { status: 500 }
    );
  }

  // Create an admin client to create a new user
  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const body = await request.json();

  // Validate critical data
  if (!body.email || !body.password || !body.options?.data) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Create the user in the 'auth.users' table.
  // Your `handle_new_user` SQL trigger (Task 1.5) will
  // fire automatically when this succeeds.
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true, // This automatically triggers the "Confirm signup" email
      user_metadata: body.options.data, // This is the 'options.data' from your frontend
    });

  if (authError) {
    console.error('Signup Error:', authError.message);
    // Provide a user-friendly error
    if (authError.message.includes('User already registered')) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Successfully created the auth user. The trigger will handle the public."User" table.
  return NextResponse.json({ success: true, user: authData.user });
}