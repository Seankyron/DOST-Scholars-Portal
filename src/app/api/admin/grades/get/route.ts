import { createServerClient } from '@supabase/ssr';
import { type Database } from '@/lib/supabase/type';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
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
        const { data: submissions, error } = await supabase
        .from('GradeSubmissionView')
        .select('*')
        .order('submission_status', { ascending: false });

        if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
        }

        
    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


