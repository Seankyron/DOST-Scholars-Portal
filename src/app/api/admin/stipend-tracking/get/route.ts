import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/type';

export async function GET() {
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
    // FETCH from the new SQL View 'stipend_tracking_view'
    // We use 'as any' for the table name because the view might not be in your generated types yet.
    // Ensure your view includes columns like: 
    // id, spas_id, full_name, university, program_course, province, 
    // academic_year, semester, status, received, unreleased, allowance_breakdown
    
    const { data, error } = await supabase
      .from('stipend_tracking_view' as any) 
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Database fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ stipends: data }, { status: 200 });

  } catch (err: any) {
    console.error('Server error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}