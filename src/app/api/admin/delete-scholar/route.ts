import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary'; // 1. Import Cloudinary

// 2. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Server configuration error: Missing keys' },
      { status: 500 }
    );
  }

  // --- 1. SECURITY CHECK (User Client) ---
  // Verify the person making the request is an Admin
  const supabaseUser = createServerClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user }, error: userError } = await supabaseUser.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: adminData, error: adminCheckError } = await supabaseUser
    .from('Admin')
    .select('id')
    .eq('id', user.id)
    .single();

  if (adminCheckError || !adminData) {
    return NextResponse.json({ error: 'Forbidden: Only admins can delete scholars' }, { status: 403 });
  }

  // --- 2. PERFORM DELETION (Service Role Client) ---
  const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const body = await request.json();
    const { id } = body; // The Scholar's ID

    if (!id) {
      return NextResponse.json({ error: 'Missing scholar ID' }, { status: 400 });
    }

    // 3. Retrieve the file key BEFORE deleting the user
    // (If we delete the user first, the row might be gone due to cascading deletes)
    const { data: scholarData } = await supabaseAdmin
      .from('User')
      .select('curriculum_file_key')
      .eq('id', id)
      .single();

    const fileKeyToDelete = scholarData?.curriculum_file_key;

    // 4. Delete from Auth Users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      throw new Error(`Auth Error: ${authError.message}`);
    }

    // 5. Cleanup Cloudinary File
    if (fileKeyToDelete) {
      try {
        // Destroy the specific file
        await cloudinary.uploader.destroy(fileKeyToDelete);
        console.log(`Deleted Cloudinary file: ${fileKeyToDelete}`);
        
        // Optional: Attempt to delete the user's folder
        // (This only works if the folder is empty)
        await cloudinary.api.delete_folder(`dost-portal/${id}/curriculums`);
        await cloudinary.api.delete_folder(`dost-portal/${id}`);
      } catch (cloudError) {
        // We log this but don't fail the request, because the user is already deleted
        console.error('Failed to cleanup Cloudinary files:', cloudError);
      }
    }

    return NextResponse.json({ success: true, id });

  } catch (err: any) {
    console.error('Delete Scholar Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}