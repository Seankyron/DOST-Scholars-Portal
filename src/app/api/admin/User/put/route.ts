import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/type';

export async function PUT(request: Request) {
  const cookieStore = cookies();

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
    const body = await request.json();
    const { id, spas_id, ...updateData } = body;

    // Validate required fields
    if ((!id && !spas_id) || Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Update error: Missing Fields' },
        { status: 400 }
      );
    }

    // Perform update
    let query = supabase.from('User').update(updateData).select().single();

    if (id) {
      query = query.eq('id', id);
    } else if (spas_id) {
      query = query.eq('spas_id', spas_id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'User updated successfully', data });
  } catch (err: any) {
    console.error('Unexpected server error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
