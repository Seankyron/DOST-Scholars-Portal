// src/app/api/admin/stipend-tracking/put/route.ts

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/type';

export async function PUT(request: Request) {
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  try {
    // Parse request body
    const body = await request.json();
    
    // Destructure expected fields from the frontend 'stipend' object
    // Note: The frontend sends 'breakdown' which maps to 'allowance_breakdown'
    // and 'pending' which maps to 'unreleased' in the DB schema.
    const { id, status, received, pending, breakdown } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'Stipend ID is required' }, { status: 400 });
    }

    // Build update object (only include fields that are provided)
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (status !== undefined) updateData.status = status;
    if (received !== undefined) updateData.received = received;
    
    // Map 'pending' from frontend to 'unreleased' in DB
    if (pending !== undefined) updateData.unreleased = pending;
    
    // Map 'breakdown' from frontend to 'allowance_breakdown' in DB
    if (breakdown !== undefined) updateData.allowance_breakdown = breakdown;

    if (Object.keys(updateData).length <= 1) { // Checks if only updated_at is present
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Update Stipend Tracking record
    const { data, error } = await supabase
      .from('Stipend Tracking')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      stipend: data, 
      message: 'Stipend updated successfully' 
    }, { status: 200 });

  } catch (err: any) {
    console.error('Unexpected server error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}