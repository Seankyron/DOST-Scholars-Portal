import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';
import { type ScholarRowData } from '@/components/admin/scholars/ScholarRow';

// Ensure you have these in your .env.local file!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: 'Missing Supabase URL or Service Role Key' },
      { status: 500 }
    );
  }

  // Create a new ADMIN client to bypass RLS
  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const scholar: ScholarRowData = await request.json();

  try {
    // --- 1. Transform data for the database ---
    const midyearClasses = [
      scholar.midyear1stYear && 1,
      scholar.midyear2ndYear && 2,
      scholar.midyear3rdYear && 3,
      scholar.midyear4thYear && 4,
    ].filter(Boolean) as number[];

    const thesisYear =
      (scholar.thesis1stYear && 1) ||
      (scholar.thesis2ndYear && 2) ||
      (scholar.thesis3rdYear && 3) ||
      (scholar.thesis4thYear && 4) ||
      0; // Default to 0

    const ojt = {
      year: scholar.ojtYear,
      semester: scholar.ojtSemester,
    };
    
    const fullAddress = `${scholar.addressBrgy}, ${scholar.addressCity}, ${scholar.addressProvince}`;

    // --- 2. Update the public.User table ---
    // This is the main data table
    const { error: userTableError } = await supabase
      .from('User')
      .update({
        spas_id: scholar.scholarId,
        email: scholar.email,
        first_name: scholar.firstName,
        middle_name: scholar.middleName,
        last_name: scholar.surname,
        suffix: scholar.suffix,
        date_of_birth: scholar.dateOfBirth,
        contact_number: scholar.contactNumber,
        address: scholar.addressBrgy, // Assuming this is Brgy/Street
        municipality_city: scholar.addressCity,
        province: scholar.addressProvince,
        scholarship_type: scholar.scholarshipType,
        year_awarded: scholar.yearAwarded,
        university: scholar.university,
        program_course: scholar.program,
        scholarship_status: scholar.status,
        course_duration: parseInt(scholar.courseDuration) || 4,
        midyear_classes: midyearClasses,
        thesis_year: thesisYear,
        ojt: ojt,
        // We don't update curriculum_file_key here unless a new file was uploaded
      })
      .eq('id', scholar.id); // Use the 'id' (UUID) to find the row

    if (userTableError) {
      throw new Error(`User Table Error: ${userTableError.message}`);
    }

    // --- 3. Update the auth.users metadata ---
    // This keeps the auth metadata in sync with the public table
    const { error: authUserError } = await supabase.auth.admin.updateUserById(
      scholar.id,
      {
        email: scholar.email, // Update email in auth as well
        user_metadata: {
          spas_id: scholar.scholarId,
          first_name: scholar.firstName,
          middle_name: scholar.middleName,
          last_name: scholar.surname,
          suffix: scholar.suffix,
          date_of_birth: scholar.dateOfBirth,
          contact_number: scholar.contactNumber,
          address: fullAddress, // A combined address for metadata
          municipality_city: scholar.addressCity,
          province: scholar.addressProvince,
          scholarship_type: scholar.scholarshipType,
          year_awarded: scholar.yearAwarded,
          university: scholar.university,
          program_course: scholar.program,
          scholarship_status: scholar.status,
          course_duration: parseInt(scholar.courseDuration) || 4,
          midyear_classes: midyearClasses,
          thesis_year: thesisYear,
          ojt: ojt,
        },
      }
    );

    if (authUserError) {
      // Note: This might fail if the email is already in use by another user
      throw new Error(`Auth User Error: ${authUserError.message}`);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Update Scholar Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}