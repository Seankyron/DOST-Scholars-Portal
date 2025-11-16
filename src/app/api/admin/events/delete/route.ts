import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/type';

export async function DELETE(request: Request) {
  const cookieStore = await cookies(); //

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, //
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
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(); //

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); //
    }

    const { data: adminData } = await supabase
      .from('Admin')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!adminData) {
      // User is authenticated, but NOT an admin
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { error: deleteError } = await supabase
      .from('Event')
      .delete()
      .eq('id', id); //

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Unexpected server error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}