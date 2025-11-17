import { createServerClient } from '@supabase/ssr';
import { type Database } from '@/lib/supabase/type';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We need an admin client to look up the user by SPAS ID
// This is separate from the user-context client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient<Database>(supabaseUrl!, serviceRoleKey!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(request: Request) {
  const { identifier, password } = await request.json();

  if (!identifier || !password) {
    return NextResponse.json(
      { error: 'Email/ID and password are required' },
      { status: 400 }
    );
  }

  let emailToLogin = identifier;

  // 1. Check if the identifier is an email or SPAS ID
  if (!identifier.includes('@')) {
    // It's a SPAS ID. Find the associated email.
    const { data: user, error: findError } = await supabaseAdmin
      .from('User')
      .select('email, is_verified')
      .eq('spas_id', identifier)
      .single();

    if (findError || !user || !user.email) {
      return NextResponse.json(
        { error: 'Invalid Scholar ID or password' },
        { status: 400 }
      );
    }

    // Check if the admin has verified them
    if (!user.is_verified) {
      return NextResponse.json(
        { error: 'Your account is still pending admin approval.' },
        { status: 401 }
      );
    }

    emailToLogin = user.email;
  }

  // 2. Now, log in the user with their email
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

  const { data, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: emailToLogin,
      password: password,
    });

  if (loginError) {
    if (loginError.message.includes('Email not confirmed')) {
      return NextResponse.json(
        { error: 'Please check your email to verify your account first.' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 400 }
    );
  }

  // 3. Login successful. Check if they are an admin to know where to redirect.
  const { data: adminData } = await supabaseAdmin
    .from('Admin')
    .select('id')
    .eq('id', data.user.id)
    .single();

  const redirectTo = adminData ? '/admin/dashboard' : '/scholar/dashboard';

  return NextResponse.json({ success: true, redirectTo });
}