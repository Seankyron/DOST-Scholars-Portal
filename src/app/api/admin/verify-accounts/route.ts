import { createServerClient } from '@supabase/ssr'; // <-- CHANGED
import { type Database } from '@/lib/supabase/type';
import { cookies } from 'next/headers'; // <-- ADDED
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = await cookies(); // <-- ADDED
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!supabaseUrl) {
    return NextResponse.json(
      { error: 'Missing Supabase URL' },
      { status: 500 }
    );
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
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

  const { userIds }: { userIds: string[] } = await request.json();
  console.log("userIds: ", userIds);

  if (!userIds || userIds.length === 0) {
    return NextResponse.json({ error: 'No user IDs provided' }, { status: 400 });
  }

  const results = await Promise.all(
    userIds.map(async (id) => {
      try {
        const { error: rpcError } = await supabase.rpc('verify_scholar', {
          user_id_to_verify: id,
        });

        if (rpcError) {
          throw new Error(`RPC Error: ${rpcError.message}`);
        }

        console.log(rpcError);
        return { id, success: true };
      } catch (err: any) {
        return { id, success: false, error: err.message };
      }
    })
  );

  return NextResponse.json({ results });
}