// src/app/api/admin/get_view/route.ts
import { createServerClient } from '@supabase/ssr';
import { type Database } from '@/lib/supabase/type';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type FetchOptions = {
  orderBy?: string;
  ascending?: boolean;
  filterColumn?: string; // --- ADDED ---
  filterValue?: string;  // --- ADDED ---
};

async function fetchView<T extends keyof Database['public']['Views']>(
  viewName: T,
  options?: FetchOptions
) {
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

  let query = supabase.from(viewName).select('*');

  // --- ADDED: Filter Logic ---
  if (options?.filterColumn && options?.filterValue) {
    query = query.eq(options.filterColumn as any, options.filterValue as any);
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? true });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const viewName = url.searchParams.get('view') as keyof Database['public']['Views'];
    const orderBy = url.searchParams.get('orderBy') ?? undefined;
    const ascending = url.searchParams.get('ascending') === 'true';
    
    // --- ADDED: Extract filter params ---
    const filterColumn = url.searchParams.get('column') ?? undefined;
    const filterValue = url.searchParams.get('value') ?? undefined;

    if (!viewName) {
      return NextResponse.json({ error: 'Missing view name' }, { status: 400 });
    }

    // --- UPDATED: Pass filters to function ---
    return fetchView(viewName, { orderBy, ascending, filterColumn, filterValue });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}