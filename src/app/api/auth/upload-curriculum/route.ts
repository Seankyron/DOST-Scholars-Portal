import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto'; // For creating unique filenames

// Configure Cloudinary with your secret keys (runs on the server)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  secure: true,
});

// Define file limits
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPE = 'application/pdf';

export async function POST(request: Request) {
  // This is an unauthenticated route, so we get the file directly
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  // --- Security Validation ---
  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  // 1. Validate File Type
  if (file.type !== ALLOWED_FILE_TYPE) {
    return NextResponse.json(
      { error: `Invalid file type. Only ${ALLOWED_FILE_TYPE} is allowed.` },
      { status: 400 }
    );
  }

  // 2. Validate File Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: `File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.` },
      { status: 400 }
    );
  }
  // --- End Security Validation ---

  // Convert the file to a buffer to prepare for streaming
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  // Upload the file to Cloudinary
  try {
    const uploadResult: any = await new Promise((resolve, reject) => {
      // Create a unique, random filename for security
      const uniqueFilename = randomUUID();
      
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          // We put all unverified curriculums in one "pending" folder
          // This makes them easy to find or clean up later.
          folder: `dost-portal/pending-curriculums`,
          public_id: uniqueFilename,
          resource_type: 'auto', // 'auto' will handle PDF
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

    // Return the "file key" (Cloudinary's public_id) to the client
    // This public_id is what you will save in your Supabase database
    return NextResponse.json({
      success: true,
      key: uploadResult.public_id, // e.g., "dost-portal/pending-curriculums/random-uuid"
    });
      
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}