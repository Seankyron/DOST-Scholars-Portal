// src/app/api/admin/grade-submissions/update/route.ts
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';
import { sendStatusEmail } from '@/lib/email/send-notification'; // <-- IMPORT THIS

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Config missing' }, { status: 500 });
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const body = await request.json();
    const { id, spas_id, status, comment, scholarStatus } = body;

    if (!id || !spas_id || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. Fetch User Email & Name (REQUIRED for email)
    const { data: userData, error: fetchError } = await supabase
      .from('User')
      .select('email, first_name')
      .eq('spas_id', spas_id)
      .single();

    if (fetchError) console.error('Error fetching user:', fetchError);

    // 2. Update Grade Submission
    const { error: submissionError } = await supabase
      .from('Grade Submission')
      .update({ status, comment })
      .eq('id', id);

    if (submissionError) throw new Error(`Submission Error: ${submissionError.message}`);

    // 3. Update Scholar Status (if provided)
    if (scholarStatus) {
      await supabase
        .from('User')
        .update({ scholarship_status: scholarStatus })
        .eq('spas_id', spas_id);
    }

    // 4. Send Notification Email
    if (userData?.email) {
      // Map your DB status to Email Status
      // Assuming DB uses 'Approved' and 'Resubmit' or 'Returned'
      const emailStatus = status === 'Approved' ? 'APPROVED' : 'RETURNED';
      
      // Only send email if it's an Approval or a Rejection/Return
      if (status === 'Approved' || status.includes('Resubmit') || status.includes('Returned')) {
         await sendStatusEmail({
          to: userData.email,
          firstName: userData.first_name || 'Scholar',
          serviceName: 'Grade Submission', // <-- Change this string for other routes
          status: emailStatus,
          comment: comment || undefined,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Update Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}