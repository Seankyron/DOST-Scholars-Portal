// src/app/api/admin/verify-accounts/route.ts
import { createServerClient } from '@supabase/ssr';
import { type Database } from '@/lib/supabase/type';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendScholarApprovalEmail } from '@/lib/email/verification'; // Import the email function

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // Use Service Role Key to ensure we can fetch user details regardless of current RLS
  // If you don't have this env var yet, use anon key but ensure "User" table is readable by admin
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase Configuration' },
      { status: 500 }
    );
  }

  // Admin Client for fetching user details
  const supabaseAdmin = createServerClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  // Regular Client for performing the RPC (preserves the admin's identity)
  const supabase = createServerClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; },
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
        // 1. Fetch User Details for Email (Using Admin Client)
        const { data: userData, error: fetchError } = await supabaseAdmin
          .from('User') // Assuming 'User' table stores public profile data
          .select('email, first_name')
          .eq('id', id)
          .single();

        if (fetchError) console.error(`Error fetching user ${id}:`, fetchError);

        // 2. Perform Verification RPC
        const { error: rpcError } = await supabase.rpc('verify_scholar', {
          user_id_to_verify: id,
        });

        if (rpcError) throw new Error(`RPC Error: ${rpcError.message}`);

        // 3. Send Email ONLY if RPC succeeded and we have user data
        if (userData?.email && userData?.first_name) {
             await sendScholarApprovalEmail(userData.email, userData.first_name);
        }

        return { id, success: true };
      } catch (err: any) {
        return { id, success: false, error: err.message };
      }
    })
  );

  return NextResponse.json({ results });
}