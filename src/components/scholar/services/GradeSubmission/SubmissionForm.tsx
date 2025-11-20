'use client';

import { FileUpload } from '@/components/ui/file-upload';
import { FileDisplayReadOnly } from '@/components/shared/FileDisplayReadOnly';
import type { SemesterAvailability, GradeSubmission } from '@/types'; 

interface SubmissionFormProps {
  semester: SemesterAvailability;
  submission: GradeSubmission | null;
  
  // File States
  regForm: File | null;
  setRegForm: (file: File | null) => void;
  gradesFile: File | null;
  setGradesFile: (file: File | null) => void;
  
  // Logic Props
  isReadOnly?: boolean;
  isResubmit?: boolean;
  adminComment?: string;
}

export function SubmissionForm({
  semester,
  submission,
  regForm,
  setRegForm,
  gradesFile,
  setGradesFile,
  isReadOnly,
  isResubmit,
  adminComment = ''
}: SubmissionFormProps) {

  const checkVisibility = (keywords: string[]) => {
    // 1. If not resubmitting (New or View), visibility depends purely on ReadOnly mode
    if (!isResubmit) return { isEditable: !isReadOnly };

    // 2. If Resubmitting, only unlock fields mentioned in the comment
    const hasMatch = keywords.some(k => adminComment.toLowerCase().includes(k));
    return { isEditable: hasMatch }; 
  };

  // Check logic for specific files
  const showRegForm = checkVisibility(['registration', 'form 5', 'cor']);
  const showGrades = checkVisibility(['grades', 'tor', 'transcript']);

  // Helper to get display name
  const regFileName = regForm?.name || submission?.registrationForm || "No file uploaded";
  const gradesFileName = gradesFile?.name || submission?.copyOfGrades || "No file uploaded";
  const regFileUrl = submission?.registrationFormUrl;
  const gradesFileUrl = submission?.copyOfGradesUrl;

  return (
    <div className="space-y-6">
      
      {/* Registration Form / Form 5 */}
      <div className="space-y-4">
        {showRegForm.isEditable ? (
          <FileUpload
            label={`Official Registration Form for ${semester.semester}`}
            helperText="Upload your scanned copy of the official Registration Form (Form 5) for this semester."
            onChange={setRegForm}
            accept="application/pdf"
            maxSizeMB={10}
            required
          />
        ) : (
          <FileDisplayReadOnly 
            label={`Official Registration Form for ${semester.semester}`}
            fileName={regFileName}
            fileUrl={regFileUrl}
          />
        )}

        {/* Certified Grades */}
        {showGrades.isEditable ? (
          <FileUpload
            label="TOR or Certified Complete Grades"
            helperText="Upload your scanned copy of your grades from 1st Year, 1st Sem up to the current semester."
            onChange={setGradesFile}
            accept="application/pdf"
            maxSizeMB={10}
            required
          />
        ) : (
          <FileDisplayReadOnly 
            label="TOR or Certified Complete Grades"
            fileName={gradesFileName}
            fileUrl={gradesFileUrl}
          />
        )}
      </div>
    </div>
  );
}