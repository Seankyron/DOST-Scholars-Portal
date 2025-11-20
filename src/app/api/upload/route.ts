import { createServerClient } from '@supabase/ssr';
import { type Database } from '@/lib/supabase/type';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your secret keys (runs on the server)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  const cookieStore = await cookies();

  // 1. Create a user-context client to check who is logged in
  const supabaseUser = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // 2. Get the logged-in user (for security)
  const { data: { user }, error: userError } = await supabaseUser.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 3. Get the file and "bucket" (which we'll use as a folder)
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const bucket = formData.get('bucket') as string | null; // e.g., 'grade-submissions'

  if (!file || !bucket) {
    return NextResponse.json({ error: 'File or bucket not provided' }, { status: 400 });
  }

  // 4. Convert the file to a buffer to prepare for streaming
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  // 5. Upload the file to Cloudinary
  try {
    const uploadResult: any = await new Promise((resolve, reject) => {
      // Use upload_stream to send the buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          // This is your "file key" logic. We organize uploads
          // into folders based on the user's ID and the bucket.
          folder: `dost-portal/${user.id}/${bucket}`,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new Error('File upload to Cloudinary failed.'));
          }
          return resolve(result);
        }
      );
      // Send the buffer to the stream
      uploadStream.end(buffer);
    });

    // 6. Return the "file key" (Cloudinary's public_id) to the client
    // This public_id is what you will save in your Supabase database
    return NextResponse.json({
      success: true,
      key: uploadResult.public_id, // e.g., "dost-portal/user-uuid/grades/random-string"
    });
      
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}