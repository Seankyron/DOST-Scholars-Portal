import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  secure: true,
});

// 2. Server-side Keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 });
  }

  // 3. Create Admin Client
  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // 4. Parse JSON (We expect JSON now, not FormData)
    const body = await request.json();
    
    // The frontend sends these two top-level properties
    const { curriculumFileKey, ...scholarData } = body;

    if (!scholarData.email || !scholarData.password || !scholarData.scholarId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 5. Transform Data for Metadata
    // We must format this to match what the 'handle_new_user' SQL trigger expects
    const midyearYears = Object.entries(scholarData.midyearClasses || {})
      .filter(([, checked]) => checked)
      .map(([year]) => parseInt(year));

    const completeAddress = `${scholarData.addressBarangay}, ${scholarData.addressCity}, ${scholarData.addressProvince}`;

    const userMetadata = {
      spas_id: scholarData.scholarId,
      first_name: scholarData.firstName,
      middle_name: scholarData.middleName || null,
      last_name: scholarData.surname,
      suffix: scholarData.suffix || null,
      date_of_birth: scholarData.dateOfBirth,
      contact_number: scholarData.contactNumber,
      address: completeAddress,
      municipality_city: scholarData.addressCity,
      province: scholarData.addressProvince,
      scholarship_type: scholarData.scholarshipType,
      year_awarded: scholarData.yearAwarded,
      university: scholarData.university,
      program_course: scholarData.program,
      midyear_classes: midyearYears,
      thesis_year: parseInt(scholarData.thesisYear) || null,
      ojt: { 
        ojtYear: parseInt(scholarData.ojtYear), // Ensure number
        ojtSemester: scholarData.ojtSemester 
      },
      course_duration: parseInt(scholarData.courseDuration) || null,
      curriculum_file_key: curriculumFileKey, // Store pending key initially
      scholarship_status: scholarData.scholarship_status,
      is_verified: true, // Admins creating users implies verification
    };

    // 6. Create User (Directly, not invite)
    // This mirrors the signup route logic
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: scholarData.email,
      password: scholarData.password,
      email_confirm: true, // Auto-confirm email since Admin created it
      user_metadata: userMetadata // Pass data for the SQL trigger
    });

    if (authError) {
      if (authError.message.includes('User already registered')) {
         return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
      }
      throw new Error(`Auth Error: ${authError.message}`);
    }

    const userId = authData.user.id; // We have the new user's ID!

    // 7. Move File to Permanent Folder (Rename)
    let finalFileKey = curriculumFileKey;

    if (curriculumFileKey) {
      // Define the new, permanent key
      const newKey = `dost-portal/${userId}/curriculums/curriculum-${userId}`;

      // Rename from "pending" to "permanent"
      const renameResult: any = await cloudinary.uploader.rename(
        curriculumFileKey, 
        newKey, 
        { overwrite: true }
      );

      finalFileKey = renameResult.public_id;

      // 8. Update DB with Final Key
      // The trigger ran at step 6 with the pending key. We must update it now.
      const { error: updateError } = await supabase
        .from('User')
        .update({ curriculum_file_key: finalFileKey })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`DB Update Error: ${updateError.message}`);
      }
    }

    return NextResponse.json({ success: true, user: authData.user });

  } catch (err: any) {
    console.error('Admin Create Scholar Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}