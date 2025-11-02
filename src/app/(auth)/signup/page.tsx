// ===== src/app/(auth)/signup/page.tsx =====
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-upload';
import { 
  SCHOLARSHIP_TYPES, 
  UNIVERSITIES, 
  YEAR_LEVELS, 
  SEMESTERS,
  PROVINCES,
  PROGRAMS_BY_UNIVERSITY 
} from '@/lib/utils/constants';
import { isValidScholarId } from '@/lib/utils/validation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type SignupStep = 1 | 2 | 3 | 4;

interface FormData {
  // Step 1: Scholar Information
  firstName: string;
  middleName: string;
  surname: string;
  suffix: string;
  dateOfBirth: string;
  contactNumber: string;
  addressBrgy: string;
  addressCity: string;
  addressProvince: string;

  // Step 2: Study Placement
  scholarshipType: string;
  yearAwarded: string;
  university: string;
  program: string;

  // Step 3: Curriculum Information
  midyear1stYear: boolean;
  midyear2ndYear: boolean;
  midyear3rdYear: boolean;
  midyear4thYear: boolean;
  thesis1stYear: boolean;
  thesis2ndYear: boolean;
  thesis3rdYear: boolean;
  thesis4thYear: boolean;
  courseDuration: string;
  ojtYear: string;
  ojtSemester: string;
  curriculumFile: File | null;

  // Step 4: Account Setup
  // --- ADDED ---
  scholarId: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeToUpdates: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isJlss, setIsJlss] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    surname: '',
    suffix: '',
    dateOfBirth: '',
    contactNumber: '+63',
    addressBrgy: '',
    addressCity: '',
    addressProvince: '',
    scholarshipType: '',
    yearAwarded: '',
    university: '',
    program: '',
    midyear1stYear: false,
    midyear2ndYear: false,
    midyear3rdYear: false,
    midyear4thYear: false,
    thesis1stYear: false,
    thesis2ndYear: false,
    thesis3rdYear: false,
    thesis4thYear: false,
    courseDuration: '4',
    ojtYear: '',
    ojtSemester: '',
    curriculumFile: null,
    // --- ADDED ---
    scholarId: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeToUpdates: false,
  });

  const supabase = createClient();

  const programOptions = (PROGRAMS_BY_UNIVERSITY[formData.university] || []).map(prog => ({
    value: prog,
    label: prog,
  }));

  const updateFormData = (field: keyof FormData, value: any) => {
    if (field === 'scholarshipType') {
      const isJlssScholar = (value as string).includes('JLSS');
      setIsJlss(isJlssScholar);
      
      // If JLSS is selected, clear and disable 1st/2nd year options
      if (isJlssScholar) {
        setFormData(prev => ({
          ...prev,
          [field]: value,
          midyear1stYear: false,
          midyear2ndYear: false,
          thesis1stYear: false,
          thesis2ndYear: false,
        }));
        setErrors(prev => ({
          ...prev,
          [field]: '',
          midyear1stYear: '',
          midyear2ndYear: '',
          thesis1stYear: '',
          thesis2ndYear: '',
        }));
        return; // Exit early
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));

    if (field === 'university') {
      setFormData(prev => ({ ...prev, program: '' }));
      setErrors(prev => ({ ...prev, program: '' }));
    }
  };

  const validateStep = (step: SignupStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.surname) newErrors.surname = 'Surname is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.contactNumber || formData.contactNumber === '+63') {
        newErrors.contactNumber = 'Contact number is required';
      }
      if (!formData.addressBrgy) newErrors.addressBrgy = 'Barangay is required';
      if (!formData.addressCity) newErrors.addressCity = 'City/Municipality is required';
      if (!formData.addressProvince) newErrors.addressProvince = 'Province is required';
    }

    if (step === 2) {
      if (!formData.scholarshipType) newErrors.scholarshipType = 'Scholarship type is required';
      if (!formData.yearAwarded) newErrors.yearAwarded = 'Year awarded is required';
      if (!formData.university) newErrors.university = 'University is required';
      if (!formData.program) newErrors.program = 'Program is required';
    }

    if (step === 3) {
      const hasThesis = formData.thesis1stYear || formData.thesis2ndYear || 
                        formData.thesis3rdYear || formData.thesis4thYear;
      if (!hasThesis) newErrors.thesis = 'Please select thesis year';
      if (!formData.ojtYear) newErrors.ojtYear = 'OJT year is required';
      if (!formData.ojtSemester) newErrors.ojtSemester = 'OJT semester is required';
      if (!formData.curriculumFile) newErrors.curriculumFile = 'Curriculum file is required';
    }

    if (step === 4) {
      // --- VALIDATION ADDED ---
      if (!formData.scholarId) {
        newErrors.scholarId = 'Scholar ID is required';
      } else if (!isValidScholarId(formData.scholarId)) {
        newErrors.scholarId = 'Invalid format. Use YYYY-XXXX (e.g., 2022-1234)';
      }
      
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as SignupStep);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as SignupStep);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Upload curriculum file first
      let curriculumUrl = '';
      console.log(formData);
      if (formData.curriculumFile) {
        const fileExt = formData.curriculumFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('signup')
          .upload(fileName, formData.curriculumFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('signup')
          .getPublicUrl(fileName);
        
        console.log(curriculumUrl);
        curriculumUrl = publicUrl;
      }

      // Create curriculum config
      const midyearYears = [];
      if (formData.midyear1stYear) midyearYears.push(1);
      if (formData.midyear2ndYear) midyearYears.push(2);
      if (formData.midyear3rdYear) midyearYears.push(3);
      if (formData.midyear4thYear) midyearYears.push(4);

      const thesisYear = formData.thesis1stYear ? 1 :
                        formData.thesis2ndYear ? 2 :
                        formData.thesis3rdYear ? 3 : 4;

      const ojtInfo = {
        ojtYear: parseInt(formData.ojtYear),
        ojtSemester: formData.ojtSemester,
      };
      console.log(ojtInfo);

      // Create account in pending verification
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            surname: formData.surname,
            // --- ADDED: Pass scholar_id to auth metadata ---
            scholar_id: formData.scholarId,
          },
        },
      });

      if (authError) throw authError;

      const completeAddress = `${formData.addressBrgy}, ${formData.addressCity}, ${formData.addressProvince}`;

      const { error: insertError } = await supabase
        .from('User')
        .insert([
          {
            spas_id: formData.scholarId,
            email: formData.email,
            password: formData.password,  //to be encrypted
            first_name: formData.firstName,
            middle_name: formData.middleName,
            last_name: formData.surname,
            suffix: formData.suffix,
            date_of_birth: formData.dateOfBirth,
            contact_number: formData.contactNumber,
            address: completeAddress,
            municipality_city: formData.addressCity,
            province: formData.addressProvince,
            scholarship_type: formData.scholarshipType,
            year_awarded: parseInt(formData.yearAwarded),
            university: formData.university,
            program_course: formData.program,
            midyear_classes: midyearYears,
            thesis_year: thesisYear,
            ojt: ojtInfo,
            course_duration: parseInt(formData.courseDuration) as 4 | 5,
            curriculum_file_key: curriculumUrl,
            is_verified: false,
            scholarship_status: 'active',
          },
        ]);

      if (insertError) throw insertError;

      // Redirect to success page
      router.push('/signup/success');
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrorMessage(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const durationOptions = [
    { value: '4', label: '4 years' },
    { value: '5', label: '5 years' },
  ];

  const provinceOptions = PROVINCES.map(p => ({ value: p, label: p }));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-dost-title mb-2">Create Account</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className={currentStep >= 1 ? 'text-dost-title font-medium' : ''}>
            Scholar Information
          </span>
          <span>→</span>
          <span className={currentStep >= 2 ? 'text-dost-title font-medium' : ''}>
            Study Placement
          </span>
          <span>→</span>
          <span className={currentStep >= 3 ? 'text-dost-title font-medium' : ''}>
            Curriculum
          </span>
          <span>→</span>
          <span className={currentStep >= 4 ? 'text-dost-title font-medium' : ''}>
            Account
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Step 1: Scholar Information */}
      {currentStep === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              error={errors.firstName}
              required
            />
            <Input
              label="Middle Name"
              value={formData.middleName}
              onChange={(e) => updateFormData('middleName', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Surname"
              value={formData.surname}
              onChange={(e) => updateFormData('surname', e.target.value)}
              error={errors.surname}
              required
            />
            <Input
              label="Suffix (Sr., Jr., III, etc.)"
              value={formData.suffix}
              onChange={(e) => updateFormData('suffix', e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              required
            />
            <Input
              label="Active Contact Number"
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => updateFormData('contactNumber', e.target.value)}
              error={errors.contactNumber}
              placeholder="+63 912 345 6789"
              required
            />
          </div>

          <h4 className="text-sm font-medium text-gray-700 pt-2">Complete Address</h4>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Province"
              value={formData.addressProvince}
              onChange={(e) => updateFormData('addressProvince', e.target.value)}
              options={provinceOptions}
              error={errors.addressProvince}
              required
            />
            <Input
              label="City / Municipality"
              value={formData.addressCity}
              onChange={(e) => updateFormData('addressCity', e.target.value)}
              error={errors.addressCity}
              required
            />
          </div>
          <Input
            label="Barangay, Street, House/Unit No."
            value={formData.addressBrgy}
            onChange={(e) => updateFormData('addressBrgy', e.target.value)}
            error={errors.addressBrgy}
            placeholder="e.g., Brgy. San Juan, 123 Rizal St."
            required
          />
        </div>
      )}

      {/* Step 2: Study Placement */}
      {currentStep === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Scholarship Type"
              value={formData.scholarshipType}
              onChange={(e) => updateFormData('scholarshipType', e.target.value)}
              options={SCHOLARSHIP_TYPES.map(type => ({ value: type, label: type }))}
              error={errors.scholarshipType}
              required
            />
            <Select
              label="Batch / Year Awarded"
              value={formData.yearAwarded}
              onChange={(e) => updateFormData('yearAwarded', e.target.value)}
              options={yearOptions}
              error={errors.yearAwarded}
              required
            />
          </div>

          <Select
            label="School / University"
            value={formData.university}
            onChange={(e) => updateFormData('university', e.target.value)}
            options={UNIVERSITIES.map(uni => ({ value: uni, label: uni }))}
            error={errors.university}
            required
          />

          <Select
            label="Program / Course"
            value={formData.program}
            onChange={(e) => updateFormData('program', e.target.value)}
            options={programOptions}
            error={errors.program}
            required
            disabled={!formData.university || programOptions.length === 0}
          />
          {programOptions.length === 0 && formData.university && (
            <p className="mt-1 text-sm text-gray-500">
              No programs listed for this university. Please contact support if this is an error.
            </p>
          )}

        </div>
      )}

      {/* Step 3: Curriculum Information */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Midyear Classes in the Curriculum:
            </label>
            <div className="grid grid-cols-4 gap-3">
              <Checkbox
                label="1st Year"
                checked={formData.midyear1stYear}
                onChange={(e) => updateFormData('midyear1stYear', e.target.checked)}
                // --- ADDED: Disabled prop ---
                disabled={isJlss} 
              />
              <Checkbox
                label="2nd Year"
                checked={formData.midyear2ndYear}
                onChange={(e) => updateFormData('midyear2ndYear', e.target.checked)}
                // --- ADDED: Disabled prop ---
                disabled={isJlss}
              />
              <Checkbox
                label="3rd Year"
                checked={formData.midyear3rdYear}
                onChange={(e) => updateFormData('midyear3rdYear', e.target.checked)}
              />
              <Checkbox
                label="4th Year"
                checked={formData.midyear4thYear}
                onChange={(e) => updateFormData('midyear4thYear', e.target.checked)}
              />
            </div>
            {/* --- ADDED: Helper text for JLSS users --- */}
            {isJlss && (
              <p className="mt-2 text-xs text-gray-500">
                1st and 2nd Year are disabled for JLSS scholars.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Thesis in the Curriculum: <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              <Checkbox
                label="1st Year"
                checked={formData.thesis1stYear}
                onChange={(e) => {
                  updateFormData('thesis1stYear', e.target.checked);
                  // ... (radio-button logic)
                }}
                // --- ADDED: Disabled prop ---
                disabled={isJlss}
              />
              <Checkbox
                label="2nd Year"
                checked={formData.thesis2ndYear}
                onChange={(e) => {
                  updateFormData('thesis2ndYear', e.target.checked);
                  // ... (radio-button logic)
                }}
                // --- ADDED: Disabled prop ---
                disabled={isJlss}
              />
              <Checkbox
                label="3rd Year"
                checked={formData.thesis3rdYear}
                onChange={(e) => {
                  updateFormData('thesis3rdYear', e.target.checked);
                  // ... (radio-button logic)
                }}
              />
              <Checkbox
                label="4th Year"
                checked={formData.thesis4thYear}
                onChange={(e) => {
                  updateFormData('thesis4thYear', e.target.checked);
                  // ... (radio-button logic)
                }}
              />
            </div>
            {errors.thesis && <p className="mt-1 text-sm text-red-500">{errors.thesis}</p>}
          </div>

          <Select
            label="Duration of Course"
            value={formData.courseDuration}
            onChange={(e) => updateFormData('courseDuration', e.target.value)}
            options={durationOptions}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Year and Semester of OJT"
              value={formData.ojtYear}
              onChange={(e) => updateFormData('ojtYear', e.target.value)}
              options={YEAR_LEVELS.slice(0, 4).map((year, idx) => ({ 
                value: (idx + 1).toString(), 
                label: year 
              }))}
              error={errors.ojtYear}
              required
            />
            <Select
              label="OJT Semester"
              value={formData.ojtSemester}
              onChange={(e) => updateFormData('ojtSemester', e.target.value)}
              options={SEMESTERS.map(sem => ({ value: sem, label: sem }))}
              error={errors.ojtSemester}
              required
            />
          </div>

          <FileUpload
            label="Course Curriculum (PDF)"
            accept=".pdf"
            onChange={(file) => updateFormData('curriculumFile', file)}
            error={errors.curriculumFile}
            required
            helperText="Upload your official curriculum from your school for verification purposes."
          />
        </div>
      )}

      {/* Step 4: Account Setup */}
      {currentStep === 4 && (
        <div className="space-y-5">
          {/* --- INPUT FIELD ADDED --- */}
          <Input
            label="Scholar ID"
            type="text"
            value={formData.scholarId}
            onChange={(e) => updateFormData('scholarId', e.target.value)}
            error={errors.scholarId}
            placeholder="YYYY-XXXX"
            helperText="Your official scholar ID provided by DOST-SEI."
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            error={errors.email}
            helperText="Use your active email address for account verification and communications."
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            error={errors.password}
            helperText="Minimum 8 characters with letters, numbers, and symbols."
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
          />

          <div className="space-y-3 pt-2">
            <Checkbox
              label="I agree to the Terms and Conditions and Privacy Policy"
              checked={formData.agreeToTerms}
              onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
            />
            {errors.agreeToTerms && (
              <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
            )}

            <Checkbox
              label="I want to receive updates and announcements via email"
              checked={formData.subscribeToUpdates}
              onChange={(e) => updateFormData('subscribeToUpdates', e.target.checked)}
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
            PREVIOUS
          </Button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <Button
            type="button"
            onClick={handleNext}
          >
            NEXT
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            CREATE ACCOUNT
          </Button>
        )}
      </div>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-dost-title font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}