import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';

// Ensure you have these in your .env.local file!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase URL or Service Role Key' },
      { status: 500 }
    );
  }

  // Create a new ADMIN client to bypass RLS
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
        // 1. Update the auth.users table to confirm the email
        const { error: authError } =
          await supabase.auth.admin.updateUserById(id, {
            email_confirm: true,
          });
        
        if (authError) throw new Error(`Auth Error: ${authError.message}`);

        // 2. Update the public.User table to mark as verified
        const { error: userTableError } = await supabase
          .from('User')
          .update({
            is_verified: true,
            scholarship_status: 'Active', // Set status to Active
          })
          .eq('id', id);

        if (userTableError) {
          throw new Error(`User Table Error: ${userTableError.message}`);
        }
        
        // TODO: Send a "Welcome & Verified" email
        // await sendVerificationEmail(userEmail);

        return { id, success: true };
      } catch (err: any) {
        return { id, success: false, error: err.message };
      }
    })
  );

  return NextResponse.json({ results });
}