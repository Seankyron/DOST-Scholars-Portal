// --- IMPORTANT: Import the *core* createClient ---
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';

// Ensure you have these in your .env.local file!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  // --- This is the critical change ---
  // Create a new ADMIN client using the Service Role Key
  // This client bypasses all RLS and has full admin rights
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase URL or Service Role Key' },
      { status: 500 }
    );
  }
  
  const supabase = createClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        // Important: this client should not impersonate a user
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  // --- End of critical change ---

  try {
    // 2. Parse the FormData from the request
    const formData = await request.formData();
    const curriculumFile = formData.get('curriculumFile') as File;
    const scholarData = JSON.parse(formData.get('scholarData') as string);

    if (!curriculumFile) {
      return NextResponse.json(
        { error: 'Curriculum file is required.' },
        { status: 400 }
      );
    }

    // 3. Upload the Curriculum File to Storage
    const fileExt = curriculumFile.name.split('.').pop();
    const fileName = `${scholarData.scholarId}_${new Date().getTime()}.${fileExt}`;
    const filePath = `curriculums/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from('signup') // Make sure this is your bucket name
      .upload(filePath, curriculumFile);

    if (storageError) {
      throw new Error(`Storage Error: ${storageError.message}`);
    }

    const curriculumFileKey = filePath;

// 4. Transform data for the 'createUser' method
    const midyearYears = Object.entries(scholarData.midyearClasses)
      .filter(([, checked]) => checked)
      .map(([year]) => parseInt(year));

    const completeAddress = `${scholarData.addressBarangay}, ${scholarData.addressCity}, ${scholarData.addressProvince}`;

    // --- NEW: Create the metadata object first for logging ---
    const userMetadata = {
      spas_id: scholarData.scholarId,
      first_name: scholarData.firstName,
      middle_name: scholarData.middleName || null, // Use null if empty
      last_name: scholarData.surname,
      suffix: scholarData.suffix || null, // Use null if empty
      date_of_birth: scholarData.dateOfBirth,
      contact_number: scholarData.contactNumber,
      address: completeAddress,
      municipality_city: scholarData.addressCity,
      province: scholarData.addressProvince,
      scholarship_type: scholarData.scholarshipType,
      year_awarded: scholarData.yearAwarded, // Keep as string
      university: scholarData.university,
      program_course: scholarData.program,
      midyear_classes: midyearYears,
      // Handle NaN from parseInt in case the select is empty
      thesis_year: parseInt(scholarData.thesisYear) || null,
      ojt: { year: scholarData.ojtYear, semester: scholarData.ojtSemester },
      course_duration: parseInt(scholarData.courseDuration) || null,
      curriculum_file_key: curriculumFileKey,
      scholarship_status: scholarData.scholarship_status,
      is_verified: true,
    };
    
    // --- NEW: Log the exact data being sent ---
    console.log("--- DATA BEING SENT TO SUPABASE ---");
    console.log(JSON.stringify(userMetadata, null, 2));
    console.log("-----------------------------------");

    // 5. Create the new user with auth.admin
const { data: authData, error: authError } =
      await supabase.auth.admin.inviteUserByEmail(
        scholarData.email,
        {
          data: userMetadata, // Pass all your metadata here
        }
      );


    if (authError) {
      throw new Error(`Auth Error: ${authError.message}`);
    }

    return NextResponse.json({ success: true, user: authData.user });
  } catch (err: any) {
    console.error('Admin Create Scholar Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}