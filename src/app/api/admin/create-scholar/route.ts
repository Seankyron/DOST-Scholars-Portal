import { createClient } from '@supabase/supabase-js'; // Changed from @supabase/ssr
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Setup Admin Client with Service Role Key
  // We need the service role key to invite users via the admin API.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase URL or Service Role Key' },
      { status: 500 }
    );
  }

  // Initialize Supabase with the Service Role Key
  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // 2. Parse the FormData from the request
    const formData = await request.formData();
    const curriculumFile = formData.get('curriculumFile') as File;
    // We need to parse the JSON string back into an object
    const scholarData = JSON.parse(formData.get('scholarData') as string);

    if (!curriculumFile) {
      return NextResponse.json(
        { error: 'Curriculum file is required.' },
        { status: 400 }
      );
    }

    // 3. Upload the Curriculum File to Storage
    // Using the admin client here bypasses RLS, ensuring the upload succeeds.
    const fileExt = curriculumFile.name.split('.').pop();
    const fileName = `${scholarData.scholarId}_${new Date().getTime()}.${fileExt}`;
    const filePath = `curriculums/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from('signup') // Ensure this bucket exists
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

    // Create the metadata object
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
      ojt: { year: scholarData.ojtYear, semester: scholarData.ojtSemester },
      course_duration: parseInt(scholarData.courseDuration) || null,
      curriculum_file_key: curriculumFileKey,
      scholarship_status: scholarData.scholarship_status,
      is_verified: true,
    };

    console.log("--- DATA BEING SENT TO SUPABASE ---");
    console.log(JSON.stringify(userMetadata, null, 2));

    // 5. Create the new user with auth.admin
    // This requires the Service Role Key client initialized above.
    const { data: authData, error: authError } =
      await supabase.auth.admin.inviteUserByEmail(
        scholarData.email,
        {
          data: userMetadata, 
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