// src/lib/actions/auth.ts
'use server';

import { createClient } from '@/lib/supabase/client'; // Your existing server client
import { createClient as createAdminClient } from '@supabase/supabase-js';

type SignupData = any;

export async function loginWithSpasIdOrEmail(
  loginInput: string,
  password: string
) {
  const supabase = createClient();

  let emailToLogin = loginInput;
  const isEmail = loginInput.includes('@');

  // If it's not an email, it's a SPAS ID. Find the associated email.
  if (!isEmail) {
    // We must use an ADMIN client to query the 'auth.users' table
    // These ENV variables must be set in your .env.local and in Vercel
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: user, error: findError } = await supabaseAdmin
      .from('users') // This is the auth.users table
      .select('email')
      .eq('raw_user_meta_data->>spas_id', loginInput) // Query the metadata
      .single();

    if (findError || !user) {
      return {
        data: null,
        error: { message: 'Invalid Scholar ID or password' },
      };
    }
    
    emailToLogin = user.email;
  }

  // --- Now, sign in with the (now guaranteed) email ---
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailToLogin,
    password: password,
  });

  if (error) {
    return { data: null, error: { message: error.message } };
  }

  // On success, the server client automatically sets the auth cookie
  // and returns the session data.
  return { data, error: null };
}

export async function signupAction(formData: FormData) {
  // Use the server client, which has service_role privileges
  const supabase = createClient(); 

  // 1. Extract the file and the stringified data
  const rawData = formData.get('data') as string;
  const file = formData.get('curriculumFile') as File;

  if (!rawData || !file) {
    return {
      data: null,
      error: { message: 'Missing form data or curriculum file.' },
    };
  }
  
  // 2. Parse the stringified data back into an object
  const data: SignupData = JSON.parse(rawData);

  // 3. Upload curriculum file
  let curriculumUrl = '';
  const fileExt = file.name.split('.').pop();
  const fileName = `curriculum_${data.scholarId}_${Date.now()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('signup') // Ensure this bucket exists and server client has access
    .upload(fileName, file);

  if (uploadError) {
    console.error('Storage Upload Error:', uploadError);
    return { data: null, error: uploadError };
  }

  // 4. Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('signup')
    .getPublicUrl(fileName);
  
  curriculumUrl = publicUrl;

  // 5. Pre-process the data (copied from your page.tsx)
  const midyearYears = [];
  if (data.midyear1stYear) midyearYears.push(1);
  if (data.midyear2ndYear) midyearYears.push(2);
  if (data.midyear3rdYear) midyearYears.push(3);
  if (data.midyear4thYear) midyearYears.push(4);

  const thesisYear = data.thesis1stYear ? 1 :
                     data.thesis2ndYear ? 2 :
                     data.thesis3rdYear ? 3 : 4;

  const ojtInfo = {
    ojtYear: parseInt(data.ojtYear),
    ojtSemester: data.ojtSemester,
  };

  const completeAddress = `${data.addressBrgy}, ${data.addressCity}, ${data.addressProvince}`;

  // 6. Create the user (auth.signUp)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        // --- Personal Info ---
        spas_id: data.scholarId,
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.surname,
        suffix: data.suffix,
        date_of_birth: data.dateOfBirth,
        contact_number: data.contactNumber,
        address: completeAddress,
        municipality_city: data.addressCity,
        province: data.addressProvince,

        // --- Scholarship Info ---
        scholarship_type: data.scholarshipType,
        year_awarded: parseInt(data.yearAwarded),
        university: data.university,
        program_course: data.program,
        
        // --- Curriculum Info ---
        midyear_classes: midyearYears,
        thesis_year: thesisYear,
        ojt: ojtInfo,
        course_duration: parseInt(data.courseDuration),
        curriculum_file_key: curriculumUrl, // Use the public URL
        
        // --- Default Statuses ---
        is_verified: false,
        scholarship_status: 'ACTIVE',
      },
    },
  });

  if (authError) {
    console.error('Auth Signup Error:', authError);
    return { data: null, error: authError };
  }

  return { data: authData, error: null };
}