'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { UNIVERSITIES, PROGRAMS_BY_UNIVERSITY, YEAR_LEVELS, SEMESTERS } from '@/lib/utils/constants';
import type { ShiftingType } from '@/types';

interface ShiftingFormProps {
  type: ShiftingType;
  isReadOnly?: boolean;
  isResubmit?: boolean;
  adminComment?: string;
}

export function ShiftingForm({ type, isReadOnly, isResubmit, adminComment = '' }: ShiftingFormProps) {
  // Fields Logic
  const isShifting = type.includes('Shifting');
  const isTransferring = type.includes('Transferring');

  // --- STATE ---
  const [newSchool, setNewSchool] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [effectivity, setEffectivity] = useState('');
  const [reason, setReason] = useState('');
  const [courseDuration, setCourseDuration] = useState('4');
  const [ojtYear, setOjtYear] = useState('');
  const [ojtSemester, setOjtSemester] = useState('');
  
  const [midyearClasses, setMidyearClasses] = useState({'1': false, '2': false, '3': false, '4': false});
  const [thesisYear, setThesisYear] = useState({'1': false, '2': false, '3': false, '4': false});

  // File States
  const [appForm, setAppForm] = useState<File | null>(null);
  const [certAdmission, setCertAdmission] = useState<File | null>(null);
  const [certSubjects, setCertSubjects] = useState<File | null>(null);
  const [certYearLevel, setCertYearLevel] = useState<File | null>(null);
  const [certGrades, setCertGrades] = useState<File | null>(null);
  const [programOfStudy, setProgramOfStudy] = useState<File | null>(null);

  // --- OPTIONS ---
  const universityOptions = UNIVERSITIES.map(u => ({ value: u, label: u }));
  const allPrograms = Object.values(PROGRAMS_BY_UNIVERSITY).flat(); 
  const programOptions = [...new Set(allPrograms)].map(p => ({ value: p, label: p }));
  const semOptions = [
    { value: '1st Semester, AY 2025-2026', label: '1st Semester, AY 2025-2026' },
    { value: '2nd Semester, AY 2025-2026', label: '2nd Semester, AY 2025-2026' },
  ];
  const durationOptions = [{ value: '4', label: '4 years' }, { value: '5', label: '5 years' }];

  // --- RENDER HELPERS ---
  const renderSelect = (label: string, value: string, setter: any, options: any[], placeholder?: string) => (
    <div className="w-full">
      {isReadOnly ? (
        <div className="space-y-1.5">
            <Label className="text-gray-500 text-xs uppercase font-semibold tracking-wider">{label}</Label>
            <div className="p-2.5 bg-gray-50 border rounded-md text-sm font-medium text-gray-900">
                {value || 'N/A'}
            </div>
        </div>
      ) : (
        <Select
            label={label}
            value={value}
            onChange={(e) => setter(e.target.value)}
            options={options}
            placeholder={placeholder}
        />
      )}
    </div>
  );

  const renderFileUpload = (label: string, helperText: string, fileState: File | null, setter: any) => {
    const isEditable = !isReadOnly; 
    
    if (isEditable) {
      return (
        <FileUpload
          label={label}
          helperText={helperText}
          onChange={setter}
          accept=".pdf,.jpeg,.png"
        />
      );
    } 
    
    // Read Only View
    return (
      <div className="space-y-2">
         <FileDisplayReadOnly 
            label={label} 
            fileName="Submitted Document.pdf" 
            fileUrl="#" // In real app, this would be the signed URL
         />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: CURRICULUM INFORMATION */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-dost-title text-white flex items-center justify-center text-xs font-bold">1</div>
            <h3 className="text-lg font-bold text-dost-title">Curriculum Information</h3>
        </div>
        
        <div className="p-5 border rounded-xl bg-gray-50/50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isShifting && renderSelect("New Course / Program", newCourse, setNewCourse, programOptions, "Select new program")}
                {isTransferring && renderSelect("New School / University", newSchool, setNewSchool, universityOptions, "Select new university")}
                {renderSelect("Effectivity", effectivity, setEffectivity, semOptions, "Select semester")}
            </div>

            <Separator className="bg-gray-200" />

            <div className="space-y-1.5">
                <Label className={isReadOnly ? "text-gray-500 text-xs uppercase font-semibold" : ""}>Reason for Application</Label>
                {isReadOnly ? (
                    <div className="p-3 bg-white border rounded-md text-sm text-gray-900 min-h-[60px]">
                        {reason}
                    </div>
                ) : (
                    <Textarea 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)} 
                        className="min-h-[80px] bg-white"
                        placeholder="Please state your valid reason..."
                    />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Midyear Checkboxes */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-3">
                    Midyear Classes in New Curriculum:
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                    {['1', '2', '3', '4'].map((year) => (
                        <Checkbox
                            key={`mid-${year}`}
                            label={`${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`}
                            checked={midyearClasses[year as keyof typeof midyearClasses]}
                            onChange={() => !isReadOnly && setMidyearClasses(p => ({...p, [year]: !p[year as keyof typeof p]}))}
                            disabled={isReadOnly}
                        />
                    ))}
                    </div>
                </div>

                {/* Thesis Checkboxes */}
                <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-3">
                    Thesis in New Curriculum:
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                    {['1', '2', '3', '4'].map((year) => (
                        <Checkbox
                            key={`thesis-${year}`}
                            label={`${year}${year === '1' ? 'st' : year === '2' ? 'nd' : year === '3' ? 'rd' : 'th'} Year`}
                            checked={thesisYear[year as keyof typeof thesisYear]}
                            onChange={() => !isReadOnly && setThesisYear(p => ({...p, [year]: !p[year as keyof typeof p]}))}
                            disabled={isReadOnly}
                        />
                    ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSelect("New Course Duration", courseDuration, setCourseDuration, durationOptions, "Select duration")}
                {renderSelect("Year of OJT", ojtYear, setOjtYear, YEAR_LEVELS.slice(0, 4).map((y, i) => ({ value: (i+1).toString(), label: y })), "Select year")}
                {renderSelect("OJT Semester", ojtSemester, setOjtSemester, SEMESTERS.map(s => ({ value: s, label: s })), "Select semester")}
            </div>
        </div>
      </div>

      {/* SECTION 2: SUPPORTING DOCUMENTS */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-dost-title text-white flex items-center justify-center text-xs font-bold">2</div>
            <h3 className="text-lg font-bold text-dost-title">Supporting Documents</h3>
        </div>

        <div className="p-6 border rounded-xl bg-white space-y-6 shadow-sm">
            {renderFileUpload("Application Form for Shifting/Transferring", "Upload the duly signed application form.", appForm, setAppForm)}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFileUpload("Certification of Admission", "Proof of acceptance in the new course/school.", certAdmission, setCertAdmission)}
                {renderFileUpload("Certification of Accredited Subjects", "List of credited subjects from previous course.", certSubjects, setCertSubjects)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFileUpload("Certification of Year Level", "Official certification of your new year level.", certYearLevel, setCertYearLevel)}
                {renderFileUpload("Certification of Grades", "Grades from all semesters enrolled (Original/Certified True Copy).", certGrades, setCertGrades)}
            </div>

            {renderFileUpload("Approved Program of Study / Curriculum", "Must be the official curriculum of the new course/school.", programOfStudy, setProgramOfStudy)}
        </div>
      </div>

    </div>
  );
}