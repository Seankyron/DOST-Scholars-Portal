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
        // Fetch all events
        const { data: events, error } = await supabase
        .from('Event')
        .select('*')
        .order('created_at', { ascending: false });

        if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const eventsWithImages = await Promise.all(
        events.map(async (event) => {
            if (!event.image_file_key) return { ...event, image_url: null };

            const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('event-banners')
            .createSignedUrl(event.image_file_key, 60 * 60); 

            if (signedUrlError) {
            console.error('Error generating signed URL:', signedUrlError.message);
            }
            console.log(signedUrlData?.signedUrl)
            return {
            ...event,
            image_url: signedUrlData?.signedUrl || null,
            };
        })
        );
    return NextResponse.json({ events: eventsWithImages }, { status: 200 });
  } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


