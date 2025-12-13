import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Setup Admin Client with Service Role Key to bypass RLS
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
    const body = await request.json();
    const { id, spas_id, status, comment, scholarStatus } = body;

    if (!id || !spas_id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 2. Update the Grade Submission
    // The trigger for 'Recent Activities' will fire here, but since we are using
    // the Service Role Key, it will bypass RLS checks.
    const { error: submissionError } = await supabase
      .from('Grade Submission')
      .update({ 
        status: status, 
        comment: comment 
      })
      .eq('id', id);

    if (submissionError) {
      throw new Error(`Submission Update Error: ${submissionError.message}`);
    }

    // 3. Update the Scholar's Status (e.g., Active, Warning)
    if (scholarStatus) {
      const { error: userError } = await supabase
        .from('User')
        .update({ scholarship_status: scholarStatus })
        .eq('spas_id', spas_id);

      if (userError) {
        throw new Error(`User Status Update Error: ${userError.message}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Update Grade Submission Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}