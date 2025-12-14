// src/app/api/admin/stipend-tracking/put/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; // Use supabase-js for Admin Client
import type { Database } from '@/lib/supabase/type';
import { sendStatusEmail } from '@/lib/email/send-notification'; // Import the email service

export async function PUT(request: Request) {
  // 1. Setup Admin Client with Service Role Key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase URL or Service Role Key' },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Parse request body
    const body = await request.json();
    
    // Destructure expected fields
    // Added 'comment' here in case you want to send a remark in the email (even if not saved to DB)
    const { id, status, received, pending, breakdown, comment } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'Stipend ID is required' }, { status: 400 });
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updateData.status = status;
    if (received !== undefined) updateData.received = received;
    if (pending !== undefined) updateData.unreleased = pending; // Map pending -> unreleased
    if (breakdown !== undefined) updateData.allowance_breakdown = breakdown;

    if (Object.keys(updateData).length <= 1) { 
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // 2. Update Stipend Tracking record using Admin Client
    const { data: stipendData, error: updateError } = await supabaseAdmin
      .from('Stipend Tracking')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Database error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 3. Send Email Notification
    // Only proceed if we have a status change that warrants an email (e.g., Released or specific updates)
    if (stipendData && stipendData.spas_id) {
      
      // Fetch User Email & Name
      const { data: userData } = await supabaseAdmin
        .from('User')
        .select('email, first_name')
        .eq('spas_id', stipendData.spas_id)
        .single();

      if (userData?.email) {
        // Map Stipend Status to Email Template Status
        // 'Released' -> APPROVED (Green/Success)
        // Any other status with a comment -> RETURNED/ACTION REQUIRED (Amber/Warning)
        let emailStatus: 'APPROVED' | 'RETURNED' | null = null;

        if (status === 'Released') {
          emailStatus = 'APPROVED';
        } else if (comment || status === 'On Hold' || status === 'Pending') {
          // If there is a comment or it's not released, treat as an update/action item
          emailStatus = 'RETURNED';
        }

        if (emailStatus) {
          await sendStatusEmail({
            to: userData.email,
            firstName: userData.first_name || 'Scholar',
            serviceName: 'Stipend Allowance',
            status: emailStatus,
            comment: comment || undefined, // Pass comment if it exists in the request body
          });
        }
      }
    }

    return NextResponse.json({ 
      stipend: stipendData, 
      message: 'Stipend updated successfully' 
    }, { status: 200 });

  } catch (err: any) {
    console.error('Unexpected server error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}