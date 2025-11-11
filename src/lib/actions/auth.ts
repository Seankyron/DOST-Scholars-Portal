'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Define the response shape for the client page
interface LoginResponse {
  error?: string;
  redirectTo?: string;
}

export async function loginWithSpasIdOrEmail(
  loginInput: string,
  password: string
): Promise<LoginResponse> {
  const cookieStore = cookies();
  // This client will be used to sign in and will hold the user's session
  const supabase = createClient(cookieStore);

  let emailToLogin = loginInput;
  const isEmail = loginInput.includes('@');

  // --- 1. Find the email if a SPAS ID was provided ---
  if (!isEmail) {
    // We must use an Admin client (with the Service Role Key)
    // to query the auth.users table for metadata.
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // This query correctly checks the 'spas_id' in the user's metadata
    const { data: user, error: findError } = await supabase
      .from('User') // This queries the auth.users table
      .select('email')
      .eq('spas_id', loginInput)
      .single();

    if (findError || !user) {
      return { error: 'Invalid Scholar ID or password' };
    }
    
    emailToLogin = user.email;
  }

  // --- 2. Sign in the user ---
  // We use the standard session-based client for this
  const { data: authData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: emailToLogin,
      password: password,
    });

  if (signInError) {
    return { error: signInError.message || 'Invalid credentials' };
  }

  // --- 3. CRITICAL: Check Role & Verification (Moved from page.tsx) ---
  // The `supabase` client now has the user's session from step 2.
  const userId = authData.user.id;

  // Check if admin
  const { data: adminData } = await supabase
    .from('Admin')
    .select('id')
    .eq('id', userId)
    .single();

    console.log("Admin: ", adminData);

  if (adminData) {
    // User is an admin
    return { redirectTo: '/admin/dashboard' };
  }

  // Check if scholar
  const { data: scholarData } = await supabase
    .from('User')
    .select('is_verified')
    .eq('id', userId)
    .single();

  if (scholarData) {
    // User is a scholar
    if (scholarData.is_verified) {
      // Scholar is verified, success!
      return { redirectTo: '/scholar/dashboard' };
    } else {
      // Scholar is not verified, sign them out and show error
      await supabase.auth.signOut();
      return { error: 'Account not verified by the admins yet.' };
    }
  }

  // User exists in auth but not in Admin or User tables
  await supabase.auth.signOut();
  return { error: 'Account not found. Please contact support.' };
}