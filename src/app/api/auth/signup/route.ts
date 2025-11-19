import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary'; // Import Cloudinary

// Configure Cloudinary (needed for the rename operation)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  secure: true,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  // Create the "super admin" client
  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const body = await request.json();
  const userData = body.options?.data; // This is your payload

  if (!body.email || !body.password || !userData) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Get the temporary key from the frontend
  const pendingFileKey = userData.curriculum_file_key;
  let finalFileKey = pendingFileKey; // Default to pending key

  try {
    // --- Step 1: Create the user in Auth ---
    // The 'handle_new_user' trigger will fire *immediately*
    // and save the 'pendingFileKey' to public."User". This is OK.
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
        user_metadata: userData, // Pass all data to the trigger
      });

    if (authError) {
      // Handle "User already exists" gracefully
      if (authError.message.includes('User already registered')) {
         return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 400 });
      }
      throw new Error(`Auth Error: ${authError.message}`);
    }

    const userId = authData.user.id; // <-- We have the new user's ID!

    // --- Step 2: Move the file in Cloudinary ---
    if (pendingFileKey) {
      // Define the new, permanent key
      const newKey = `dost-portal/${userId}/curriculums/curriculum-${userId}`;
      
      // Tell Cloudinary to move (rename) the file
      const renameResult: any = await cloudinary.uploader.rename(
        pendingFileKey, // From (the temporary key)
        newKey,         // To (the new, permanent key)
        { overwrite: true }
      );

      finalFileKey = renameResult.public_id; // This is the new, final key

      await cloudinary.uploader.destroy(pendingFileKey);
      console.log(`Deleted Cloudinary file: ${pendingFileKey}`);
      
      // --- Step 3: FIX. Update public."User" with the *final* key ---
      // This is the step that was missing. We now update the
      // 'public."User"' table directly, correcting the
      // 'pendingFileKey' that the trigger just saved.
      const { error: updateError } = await supabase
        .from('User')
        .update({ curriculum_file_key: finalFileKey })
        .eq('id', userId);

      if (updateError) {
        // If this fails, the user is created but the file key is wrong.
        // This is a critical error.
        throw new Error(`DB Update Error: ${updateError.message}`);
      }
    }

    return NextResponse.json({ success: true, user: authData.user });

  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}