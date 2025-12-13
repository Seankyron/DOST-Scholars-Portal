// src/app/api/admin/reject-accounts/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendRejectionEmail } from '@/lib/email'; // Import the email function

export async function POST(request: Request) {
  // Use the Service Role Key for Admin Auth operations
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  );

  // Expect 'reason' in the body
  const { userIds, reason }: { userIds: string[], reason: string } = await request.json();

  if (!userIds || userIds.length === 0) {
    return NextResponse.json({ error: 'No user IDs provided' }, { status: 400 });
  }

  // Default reason if none provided
  const rejectionReason = reason || "Documents submitted were invalid or incomplete.";

  const results = await Promise.all(
    userIds.map(async (id) => {
      try {
        // 1. Fetch user to get the email address BEFORE deleting
        const { data: { user }, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(id);
        
        if (fetchError || !user || !user.email) {
            console.error(`Could not fetch email for user ${id}:`, fetchError);
            // Proceed to delete anyway? Or fail? 
            // Usually we still want to delete the account even if email fails.
        }

        // 2. Send the Rejection Email
        if (user && user.email) {
          await sendRejectionEmail(user.email, rejectionReason);
        }

        // 3. Delete the user
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);
        
        if (deleteError) throw new Error(`Auth Error: ${deleteError.message}`);

        return { id, success: true };
      } catch (err: any) {
        return { id, success: false, error: err.message };
      }
    })
  );

  return NextResponse.json({ results });
}