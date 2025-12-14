// src/app/api/admin/update-scholar/route.ts

import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/lib/supabase/type';
import { NextResponse } from 'next/server';
import { type ScholarRowData } from '@/components/admin/scholars/ScholarRow';
import { sendScholarStatusEmail } from '@/lib/email/scholarStatus'; // <-- IMPORT THIS

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
    // --- 0. PRE-FETCH: Get current status to check for changes ---
    // We need to know if the status actually changed to decide if we send an email.
    const { data: currentScholarData, error: fetchError } = await supabase
      .from('User')
      .select('scholarship_status, email, first_name')
      .eq('id', scholar.id)
      .single();

    if (fetchError) {
      console.warn("Could not fetch previous scholar status:", fetchError);
    }

    const previousStatus = currentScholarData?.scholarship_status;
    const hasStatusChanged = previousStatus && previousStatus !== scholar.status;

    // --- 1. Transform data for the database (EXISTING CODE) ---
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
      0; 

    const ojt = {
      year: scholar.ojtYear,
      semester: scholar.ojtSemester,
    };
    
    const fullAddress = `${scholar.addressBrgy}, ${scholar.addressCity}, ${scholar.addressProvince}`;

    // --- 2. Update the public.User table (EXISTING CODE) ---
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
        address: scholar.addressBrgy,
        municipality_city: scholar.addressCity,
        province: scholar.addressProvince,
        scholarship_type: scholar.scholarshipType,
        year_awarded: scholar.yearAwarded,
        university: scholar.university,
        program_course: scholar.program,
        scholarship_status: scholar.status, // <--- This is the new status
        course_duration: parseInt(scholar.courseDuration) || 4,
        midyear_classes: midyearClasses,
        thesis_year: thesisYear,
        ojt: ojt,
      })
      .eq('id', scholar.id);

    if (userTableError) {
      throw new Error(`User Table Error: ${userTableError.message}`);
    }

    // --- 3. Update the auth.users metadata (EXISTING CODE) ---
    const { error: authUserError } = await supabase.auth.admin.updateUserById(
      scholar.id,
      {
        email: scholar.email,
        user_metadata: {
            // ... (keep existing metadata updates)
            scholarship_status: scholar.status,
            // ...
        },
      }
    );

    if (authUserError) {
      throw new Error(`Auth User Error: ${authUserError.message}`);
    }

    // --- 4. Handle Suspension Logic (EXISTING CODE) ---
    if (scholar.status === 'Suspended') {
       // ... (keep existing suspension logic)
    }

    // --- 5. SEND EMAIL IF STATUS CHANGED ---
    if (hasStatusChanged) {
        // Run this in the background (don't await) so the UI updates instantly
        // Or await it if you want to ensure delivery before responding
        sendScholarStatusEmail(
            scholar.email,
            scholar.firstName,
            scholar.status,
            // You can pass "scholar.remarks" here if you add a remarks field to your ScholarRowData in the future
        );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Update Scholar Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}