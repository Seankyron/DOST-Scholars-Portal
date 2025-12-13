import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
  secure: true,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;
    const folder = formData.get('folder') as string | null;
    const public_id = formData.get('public_id') as string | undefined;

    if (!file || !folder) {
      return NextResponse.json({ error: 'File or folder not provided' }, { status: 400 });
    }

    // Convert Blob/File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload using upload_stream
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder, 
          // FIX: Ensure this line exists to force the filename
          public_id: public_id, 
          access_mode: 'public', 
        }, 
        (err, res) => {
          if (err) return reject(err);
          resolve(res);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      publicId: result.public_id,
      url: result.secure_url,
    });
  } catch (err: any) {
    console.error('Cloudinary upload failed:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}